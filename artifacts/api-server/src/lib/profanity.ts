const BANNED_WORDS = [
  "amk",
  "aq",
  "amq",
  "orospu",
  "orospu",
  "piç",
  "pic",
  "yarrak",
  "yarak",
  "sik",
  "siktir",
  "sikeyim",
  "sikik",
  "göt",
  "gavat",
  "kahpe",
  "kaltak",
  "ibne",
  "ibine",
  "puşt",
  "pust",
  "amcık",
  "amcik",
  "amına",
  "amina",
  "anan",
  "ananı",
  "anani",
  "anasını",
  "anasini",
  "oç",
  "oc.",
  "salak",
  "gerizekalı",
  "gerizekali",
  "mal herif",
  "fuck",
  "shit",
  "bitch",
  "asshole",
];

function normalize(input: string): string {
  return input
    .toLocaleLowerCase("tr")
    .replace(/[0@]/g, "o")
    .replace(/[1!|]/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t");
}

export function containsProfanity(...parts: string[]): boolean {
  const text = normalize(parts.filter(Boolean).join(" "));
  const tokens = text.split(/[^a-zçğıöşü]+/i).filter(Boolean);
  const tokenSet = new Set(tokens);
  for (const word of BANNED_WORDS) {
    const w = normalize(word).trim();
    if (!w) continue;
    if (w.includes(" ")) {
      if (text.includes(w)) return true;
      continue;
    }
    if (tokenSet.has(w)) return true;
    // catch padded variants like "s.i.k" already normalized away; also direct substring for short slurs
    if (w.length >= 4 && text.includes(w)) return true;
  }
  return false;
}
