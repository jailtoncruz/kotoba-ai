import ShortUniqueId from 'short-unique-id';

const uid = new ShortUniqueId({
  dictionary: 'alphanum_upper',
});

export function generateCode(parts: number = 2, length: number = 4): string {
  const blocks: string[] = [];
  for (let i = 0; i < parts; i++) {
    blocks.push(uid.randomUUID(length));
  }
  return blocks.join('-');
}
