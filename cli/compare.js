#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { compare } from '../src/engine.js';
import { toMarkdown, toCsv } from '../src/report.js';

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
}

function usage() {
  console.error(`Usage: node cli/compare.js --a path-a.json --b path-b.json --decisions reviewer-decisions.json [--out report.md] [--json report.json] [--csv report.csv]`);
  process.exit(1);
}

const aPath = arg('a'), bPath = arg('b'), decisionsPath = arg('decisions');
if (!aPath || !bPath || !decisionsPath) usage();

const a = JSON.parse(fs.readFileSync(aPath, 'utf8'));
const b = JSON.parse(fs.readFileSync(bPath, 'utf8'));
const decisionsFile = JSON.parse(fs.readFileSync(decisionsPath, 'utf8'));
const decisions = Array.isArray(decisionsFile) ? decisionsFile : decisionsFile.decisions;

let result;
try {
  result = compare(a, b, decisions);
} catch (err) {
  console.error('Comparison failed validation:\n' + err.message);
  process.exit(2);
}

const outMd = arg('out');
const outJson = arg('json');
const outCsv = arg('csv');

if (outMd) { fs.mkdirSync(path.dirname(outMd), { recursive: true }); fs.writeFileSync(outMd, toMarkdown(result)); console.log(`Wrote ${outMd}`); }
if (outJson) { fs.mkdirSync(path.dirname(outJson), { recursive: true }); fs.writeFileSync(outJson, JSON.stringify(result, null, 2)); console.log(`Wrote ${outJson}`); }
if (outCsv) { fs.mkdirSync(path.dirname(outCsv), { recursive: true }); fs.writeFileSync(outCsv, toCsv(result)); console.log(`Wrote ${outCsv}`); }

if (!outMd && !outJson && !outCsv) {
  console.log(toMarkdown(result));
}
