/**
 * This module implements Variable-length encoding/decoding for a list of members using Elias Gamma coding.
 * Each MetaVote contains a numeric ID (up to 1e6) and a position string.
 * The assumption making Elias Gamma coding efficient here is that the list of sorted member IDs is mostly distributed densely
 *   towards a certain range (happens to be the end) making the gaps mostly small => Efficiently encoded with Elias Gamma.
 */
import { Position, MemberVote } from '@/types';

export const POSSIBLE_POSITIONS: Position[] = [
  'FOR',
  'AGAINST',
  'DID_NOT_VOTE',
  'ABSTENTION',
];

export interface MetaVote {
  member: {
    id: number;
  };
  position: Position;
}

/**
 * BitWriter class writes bits to a byte array.
 */
class BitWriter {
  private bytes: number[] = [];
  private currentByte = 0;
  private bitOffset = 0;

  /**
   * Writes the lowest `bits` bits of value into the stream.
   * @param value The numeric value to write.
   * @param bits Number of bits to write.
   */
  writeBits(value: number, bits: number): void {
    for (let i = bits - 1; i >= 0; i--) {
      const bit = (value >> i) & 1;
      this.currentByte = (this.currentByte << 1) | bit;
      this.bitOffset++;
      if (this.bitOffset === 8) {
        this.bytes.push(this.currentByte);
        this.currentByte = 0;
        this.bitOffset = 0;
      }
    }
  }

  /**
   * Finishes writing and returns the resulting Uint8Array.
   */
  finish(): Uint8Array {
    if (this.bitOffset > 0) {
      this.currentByte <<= (8 - this.bitOffset);
      this.bytes.push(this.currentByte);
    }
    return new Uint8Array(this.bytes);
  }
}

/**
 * BitReader class reads bits from a Uint8Array.
 */
class BitReader {
  private bytes: Uint8Array;
  private bytePos = 0;
  private bitOffset = 0;

  constructor(uint8Array: Uint8Array) {
    this.bytes = uint8Array;
  }

  /**
   * Reads the next `bits` bits from the stream.
   * @param bits Number of bits to read.
   * @returns The numeric value represented by these bits.
   */
  readBits(bits: number): number {
    let value = 0;
    for (let i = 0; i < bits; i++) {
      if (this.bytePos >= this.bytes.length) {
        throw new Error("EOF reached while reading bits");
      }
      const currentByte = this.bytes[this.bytePos];
      const bit = (currentByte >> (7 - this.bitOffset)) & 1;
      value = (value << 1) | bit;
      this.bitOffset++;
      if (this.bitOffset === 8) {
        this.bitOffset = 0;
        this.bytePos++;
      }
    }
    return value;
  }
}

/**
 * Encodes a positive integer (n >= 1) using Elias Gamma coding.
 * @param n A positive integer (n >= 1) to encode.
 * @returns A string representing the binary code (composed of '0's and '1's).
 */
function eliasGammaEncode(n: number): string {
  const binary = n.toString(2);
  const prefix = '0'.repeat(binary.length - 1);
  return prefix + binary;
}

/**
 * Writes a binary string (composed of '0' and '1') to a BitWriter.
 * @param bw The BitWriter instance.
 * @param bitStr The string containing the binary code.
 */
function writeBitString(bw: BitWriter, bitStr: string): void {
  for (const bit of bitStr) {
    bw.writeBits(bit === '1' ? 1 : 0, 1);
  }
}

/**
 * Decodes an Elias Gamma encoded integer from the BitReader.
 * @param br The BitReader instance.
 * @returns The decoded integer.
 */
function eliasGammaDecode(br: BitReader): number {
  let zeros = 0;
  while (br.readBits(1) === 0) {
    zeros++;
  }
  let value = 1;
  for (let i = 0; i < zeros; i++) {
    value = (value << 1) | br.readBits(1);
  }
  return value;
}

/**
 * Encodes an array of members using variable-length Elias Gamma coding.
 * 
 * The encoding process:
 * - Sorts the members by their member.id.
 * - Writes the first id using 20 bits.
 * - For each member, writes its gap from the previous id using Elias Gamma encoding (gap+1, since gamma codes need n>=1),
 *   then writes the position as 2 bits (using the index in POSSIBLE_POSITIONS).
 * 
 * @param members Array of Member objects to encode.
 * @returns A Uint8Array representing the compressed binary data.
 */
function encodeEliasGammaMembers(members: (MetaVote|MemberVote)[]): Uint8Array {
  const sorted = [...members].sort((a, b) => a.member.id - b.member.id);
  const bw = new BitWriter();
  // Write first member's id (20 bits) and position (2 bits)
  let prev = sorted[0].member.id;
  bw.writeBits(prev, 20);
  bw.writeBits(POSSIBLE_POSITIONS.indexOf(sorted[0].position), 2);

  // Write subsequent members: Elias Gamma encoded gap (gap+1) then position (2 bits)
  for (let i = 1; i < sorted.length; i++) {
    const cur = sorted[i].member.id;
    const gap = cur - prev;
    const code = eliasGammaEncode(gap + 1);
    writeBitString(bw, code);
    bw.writeBits(POSSIBLE_POSITIONS.indexOf(sorted[i].position), 2);
    prev = cur;
  }
  return bw.finish();
}

/**
 * Decodes a Uint8Array produced by encodeEliasGammaMembers back into an array of Member objects.
 * 
 * @param encoded A Uint8Array of compressed data.
 * @param count The number of members originally encoded.
 * @returns An array of Member objects.
 */
function decodeEliasGammaMembers(encoded: Uint8Array, count: number): MetaVote[] {
  const br = new BitReader(encoded);
  const result: MetaVote[] = [];
  // Read first member's id and position
  let prev = br.readBits(20);
  result.push({
    member: { id: prev },
    position: POSSIBLE_POSITIONS[br.readBits(2)]
  });
  
  // Read each subsequent member
  for (let i = 1; i < count; i++) {
    const gapPlusOne = eliasGammaDecode(br);
    const gap = gapPlusOne - 1;
    const id = prev + gap;
    const posCode = br.readBits(2);
    result.push({
      member: { id },
      position: POSSIBLE_POSITIONS[posCode]
    });
    prev = id;
  }
  return result;
}

export { 
  decodeEliasGammaMembers as decodePositions,
  encodeEliasGammaMembers as encodePositions,
}
