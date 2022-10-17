require("dotenv").config();
const express = require("express");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const fs = require("fs");
const router = express.Router();

const verifyWhitelist = (address) => {
  let temp = fs.readFileSync(`./whitelist/whitelist.json`);
  let whiteListArray = JSON.parse(temp);
  // console.log("whitelistarray: ", whiteListArray);
  console.log("address: ", address);
  const leaves = whiteListArray.map((v) => keccak256(v));
  const tree = new MerkleTree(leaves, keccak256, { sort: true });
  const root = tree.getHexRoot();
  const leaf = keccak256(address);
  const proof = tree.getHexProof(leaf);
  const verified = tree.verify(proof, leaf, root);
  return { proof, leaf, verified };
};

const getWhitelistRoot = () => {
  const whiteListArray = require("../whitelist/whitelist").whitelist.array;
  const leaves = whiteListArray.map((v) => keccak256(v));
  const tree = new MerkleTree(leaves, keccak256, { sort: true });
  return tree.getHexRoot();
};

// @route    GET signature/:address
// @access   Public
router.get("/:address", async (req, res) => {
  try {
    const { proof, leaf, verified } = verifyWhitelist(req.params.address);
    console.log("proof", proof, "leaf",  leaf, "verified", verified);
    res.status(200).send({
      success: true
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "NFT not found" });
    }
    res.status(500).send("Server Error");
  }
});

router.get("/root", async (req, res) => {
  try {
    const root = getWhitelistRoot();
    res.status(200).send({
      root,
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "NFT not found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
