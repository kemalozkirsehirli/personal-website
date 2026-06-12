---
title: "AI for Science Notes"
description: "A working note on models, molecules, benchmarks, and scientific judgment."
date: "2026-06-12"
tags: ["AI for Science", "CADD", "Research"]
draft: false
cover: "/photos/wordcloud.svg"
---

The part of AI for science I care about most is not model worship. It is the conversion of scientific complexity into representations that can be inspected, tested, compiled into workflows, and ultimately used for better decisions.

Across protein design, chromatin modeling, free-energy methods, statistical mechanics, and computational drug discovery, the recurring question is the same: what does the model know, what does it merely imitate, and where does it fail?

## Current themes

- Protein foundation-model red-teaming and reliability checks.
- Conditional diffusion models for 3D chromatin ensembles.
- Genetics-to-mechanism target discovery for autoimmune disease.
- CADD pipelines that combine docking, QSAR, Boltz-style co-folding, MMGBSA/FEP, novelty filters, and supplier-aware chemistry.
- LLM-guided quantum chemistry and statistical-mechanics workflows.

## Standard I want from models

A scientific model should help answer four questions:

- What should we try next?
- What is the uncertainty?
- What would change our mind?
- Which failure mode would matter in a real workflow?

That last question is the difference between a leaderboard artifact and a tool that can survive contact with chemistry, biology, and experimental reality.
