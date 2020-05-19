const {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} = require("fs");
const { join } = require("path");

const formatDeck = ({ metadata, blackCards, whiteCards }) => {
  return {
    title: metadata.name,
    blackCards: blackCards
      .split("\n")
      .filter((text) => text)
      .map((text, id) => ({
        id,
        text,
        pick: text.match(/_/g) ? text.match(/_/g).length : 1,
      })),
    whiteCards: whiteCards
      .split("\n")
      .filter((text) => text)
      .map((text, id) => ({
        id,
        text,
      })),
  };
};

readdirSync("src")
  .filter((path) => statSync(join("src", path)).isDirectory())
  .map((path) => ({
    metadataPath: join(__dirname, "src", path, "metadata.json"),
    blackCardsPath: join(__dirname, "src", path, "black.html.txt"),
    whiteCardsPath: join(__dirname, "src", path, "white.html.txt"),
  }))
  .filter(
    ({ metadataPath, blackCardsPath, whiteCardsPath }) =>
      existsSync(metadataPath) &&
      existsSync(blackCardsPath) &&
      existsSync(whiteCardsPath)
  )
  .map(({ metadataPath, blackCardsPath, whiteCardsPath }) => ({
    metadata: JSON.parse(readFileSync(metadataPath, "utf8")),
    blackCards: readFileSync(blackCardsPath, "utf8"),
    whiteCards: readFileSync(whiteCardsPath, "utf8"),
  }))
  .filter(({ metadata }) => metadata.official)
  .map(({ metadata, blackCards, whiteCards }) =>
    writeFileSync(
      join("dist", `${metadata.abbr}.json`),
      JSON.stringify(formatDeck({ metadata, blackCards, whiteCards }), null, 2)
    )
  );
