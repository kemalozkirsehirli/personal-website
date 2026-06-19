---
title: "CV"
description: "Education, recognition, research, engineering, teaching, computational skills, languages, interests, and hobbies."
---

# Kemal Özkırşehirli

**MIT B.Sc. Candidate** — Computer Science and Engineering: AI/ML; Physics: Chemical Physics; Mathematics: Mathematical Biology. Minors in Philosophy and Writing.  
Cambridge, MA · [kemalozk@mit.edu](mailto:kemalozk@mit.edu) · [LinkedIn](https://linkedin.com/in/kozkirsehirli) · [GitHub](https://github.com/kemalozkirsehirli) · [Google Scholar](https://scholar.google.com/citations?user=SKE-LC8AAAAJ)

I am an international student from İstanbul, Türkiye, pursuing a rare triple major in Computer Science and Engineering: AI/ML, Physics: Chemical Physics, and Mathematics: Mathematical Biology, with minors in Philosophy and Writing. I am on track to graduate one year early, completing all requirements for three majors and two minors in three total years of undergraduate education. I leverage AI/ML frameworks, generative and diffusion models, free-energy methods, atomistic molecular dynamics, Monte Carlo, density-functional-theory simulations, inference, and robust optimization to turn scientific complexity into parsable, compilable, and computable representations and extract their governing rules for critical scientific decision-making.

## Education

**Massachusetts Institute of Technology** — Cambridge, MA  
B.Sc. expected May 2027. GPA: 5.0/5.0. On track to graduate one year early after completing all requirements for a rare triple major and two minors in three total years of undergraduate education.

- Majors: Computer Science and Engineering: AI/ML; Physics: Chemical Physics; Mathematics: Mathematical Biology.
- Minors: Philosophy, Writing.
- Research interests: biomolecular simulation; free-energy methods; CADD; statistical mechanics and renormalization-group theory; chemical diffusion; high-performance computing; generative models; scientific workflow and DNA–RNA engineering; agentic AI; inference.
- Computational skillset: Python, C/C++, CUDA, PyTorch, Transformers, GNNs, HPC/GPU programming, Linux, Bash, Git, SLURM/PBS/qsub.
- Coursework: 6.7960 Deep Learning; 6.5060 Algorithm Engineering; 6.4610 Natural Language Processing; 6.3930 AI and Decision Making in Medicine: From Disease to Therapy; 6.1220[J] Advanced Algorithm Design-Analysis; 18.404[J] Theory of Computation; 18.615 Stochastic Processes; 6.5240 Sublinear Time Algorithms; 6.1910 Computer Structures and Architectures; 6.100B, 6.1903, and related Python/C/C++/Assembly programming labs; 18.600 Probability Theory and Random Variables; 18.06 Linear Algebra; 5.43 Advanced Organic Chemistry; 6.1200[J] Discrete Mathematics.
- Humanitas Core: 24.245 Theory of Models; 21W.747 Rhetoric; 21W.745 Advanced Essay Workshop; 21W.762 Poetry Workshop; 24.251 Philosophy of Language; 24.05 Philosophy of Religion; 17.01[J]/24.04[J] Justice; 24.121 Metaphysics; 21W.738[J] Memoir.

## Activities

- AI@MIT.
- Schwarzman College of Computing Advisor.
- MIT BioMakers.
- MIT Student Council Representative.
- ClubChem.
- MIT Gala Model/Designer.

## Recognition

- Medalist in the 56th International Chemistry Olympiad, representing Türkiye; ranked 105th internationally among 327 participants.
- Medalist in the 58th International Mendeleev Chemistry Olympiad, representing Türkiye; ranked 73rd internationally among 151 participants.
- Silver Medal in the TÜBİTAK National Chemistry Olympiad; ranked 3rd nationally among 62 finalists and 2,500+ students to represent Türkiye.
- Gold Medal in the Istanbul Science Olympiads 2022 in Chemistry; ranked first in Istanbul among 50 finalists.
- Columbia Science Research Fellow Named Scholar; awarded a full-ride early with a Likely Letter in recognition of scientific accomplishment and talent.
- World Science Scholar, 2023 cohort; selected among 52 scholars from 22 countries for exceptional mathematical talent and as the fourth Turkish scholar in program history.
- AIME qualification and AMC Hall of Fame acknowledgement; 7th place in Türkiye and a top-5% AMC 12 score among 300,000+ participants.
- Selected to attend AlgoTrade Hackathon 2026 with free travel and accommodation from 1,000+ applicants across 51 countries and 148 universities.
- Transferred to MIT from Columbia as one of 22 selected from 764 applicants, a 2.5% acceptance rate.
- CHEM13 Certificate of Distinction, University of Waterloo International Exam; ranked 2nd among 1,551 participants.
- Certificate of Distinction, Galois International Mathematics Contest; ranked 7th among 3,071 international students and 20th globally among 6,595.
- Book Prize, Sir Isaac Newton International Physics Contest, University of Waterloo; ranked in the top 50 globally among 2,000+ participants.

## Experiences

### Principal Investigator — Order-Agnostic MeshAnyOrder for Life Sciences

**Özkırşehirli Group — independent 7-member research collaboration with a Google-affiliated research lead** — Apr 2026–Present

- Leading MeshAnyOrder, an order-agnostic autoregressive transformer for point-cloud-conditioned 3D mesh generation that represents faces as quantized tokens and predicts unvisited adjacent faces from arbitrary traversal seeds.
- Extending the architecture with 3D rotary positional encoding for translation-invariant attention, heterogeneous triangle/quad tokenization, topology-aware validity constraints, frontier-parallel decoding, and local mesh completion/remeshing.
- Designing publication-grade ablations across random, axis-based, BFS/DFS traversal and causal, adjacency-aware, and bidirectional masking; evaluating reconstruction quality, manifoldness, watertightness, inference latency, memory consumption, and high-resolution scaling against leading autoregressive and diffusion-based mesh generators.

### Principal Investigator — Özkırşehirli Group; Team Leader, TBXT Small-Molecule Hackathon

**MIT and onepot** — Apr 2026–Present

- Leading an 11-person chordoma-focused TBXT/brachyury computational hit-identification project targeting PDB 6F59 chain A / TBXT G177D site F; compressed 2,274 prior-art compounds plus 737 raw analogs into 503 filtered analogs, 30,000 BRICS recombinations, 67 novel QSAR-pass proposals, and a 570-compound novelty-filtered pool using site-F/A/G grids, Tanimoto novelty control, and sourceability-aware generation.
- Integrated a multi-orthogonal AI/CADD stack: Vina ensemble docking, GNINA CNN pose/pKd scoring, Vina-trap detection, RF/XGBoost TBXT QSAR, Boltz-2 co-folding, MMGBSA/FEP scaffolding, T-box paralog selectivity, Rowan IC50/affinity analysis, RDKit descriptors/BRICS, onepot/muni catalog checks, and Bash/HPC automation. Trained QSAR on 650 RDKit-valid SPR-derived compounds from 14 decrypted XLSX files, 15 campaigns, and 1,620 Kd fits, achieving Spearman ρ ≈ 0.49 and MAE ≈ 0.5 pKd; GNINA screened 569 of 570 candidates and flagged 40 Tier-A, 51 Tier-B, and 73 Vina-trap candidates.
- Prioritized a final funnel of 570 → 137 strict-pass → 24 submission-ready → 4 judge-facing site-F picks under exact-match, non-covalent chemistry, PAINS/forbidden-motif, lead-likeness, ESOL/logS, Tanimoto, cost, chemistry, supplier-risk, and 16-paralog selectivity gates. The final four showed Boltz Kd values of 3.2–8.8 µM, Jack/SCC agreement of 1.01–1.34×, GNINA Vina scores of −5.01 to −6.19, pKd values of 3.94–4.69, and Rowan IC50-style predictions of 1.82–6.11 µM.

### PRISM AI Safety Fellow — Protein Foundation Model Red-Teaming and Evaluation

**PRISM, W2D2, Siemens** — May 2026–Present

- Selected from 800+ applicants for PRISM 2026 to develop adversarial evaluation methods for protein foundation models, testing when biologically plausible outputs fail sequence–structure–function constraints, uncertainty calibration, and protein-design reliability checks.
- Creating methods to evaluate high-stakes protein-design reliability across biological plausibility, structural consistency, developability, uncertainty calibration, claimed mechanisms, and failure behavior.
- Building a safety-bounded benchmark and failure taxonomies for next-generation protein models using prior work in EVEdesign, A*STAR V2M, antibody/protein models, CADD, and uncertainty-aware candidate ranking.

### Summer UROP Scholar — ChromoGen-Engine V2

**MIT Chemistry, Computational Systems Biology; Prof. Zhang** — May 2026–Present

- Developing ChromoGen-Engine V2, a conditional diffusion and evaluation pipeline merging ChromoGen-style single-cell 3D chromatin generation with small-molecule perturbation data and same-cell multi-omic regulatory readouts.
- Building a data engine that integrates Plate-C / Easy Dip-C small-molecule treatment structures with CHARM-style same-cell Hi-C, RNA-seq, ATAC-seq, and histone-modification data under leakage-aware splits across treatment, dose/time, cell state, genomic window, batch, and source.
- Designing a structure-grounded benchmark comparing perturbation and regulatory-state conditioning with sequence-only, population-ATAC, pseudobulk/metacell, shuffled-label, and ablated baselines using distance/contact agreement, P(s) decay, condition separation, ensemble coverage, calibration, failure-mode analysis, and interpretable attribution.

### Summer AI/ML Researcher — Autoimmune Target Discovery

**Experimental Drug Development Centre, A*STAR** — May 2026–Present

- Architecting V2M-Engine with Dr. Sun and Dr. Cai, a calibrated genetics-to-mechanism target-discovery framework that maps autoimmune GWAS and fine-mapped variants onto regulatory programs, causal immune cell types/states, and targetable disease mechanisms using single-cell foundation models, QTL/colocalization evidence, and known therapeutic targets as embedded controls.
- Building a Target-Mechanism Retrodiction Benchmark that tests whether scGPT/Geneformer-derived cell-state embeddings recover known immune-disease mechanisms beyond enrichment, marker-gene, pathway, and eQTL/colocalization baselines, with ablations, uncertainty quantification, calibration-error analysis, and leakage-controlled target-family holdouts.
- Developing a modular sequence-to-cell-state-to-targetability engine coupling Evo 2/EVEE-style variant-effect scoring, Perturb-seq validation, counterfactual immune-state transport, and structure/affinity-aware target prioritization.

### Head of Chemistry Research-Implementation; Backend Software Engineer for LangGraph AI Agent Pipelines

**Pedal AI** — Jul–Dec 2025

- Designed Python/LangGraph backend architecture and FastAPI interfaces connecting stateful chemistry agents with molecular-prediction engines, including persistent execution state, custom tool orchestration, scalable control flow, and model/data evaluation workflows.
- Built chemist- and researcher-facing UI/UX for Pedal AI's Agentic Chemistry Platform, incorporating Coley Lab retrosynthesis models with ASKCOS-style route search, inspectable retrosynthesis trees, reaction-level provenance, and decision-ready synthesis workflows.

### LLM and Statistical Mechanics/Theoretical Chemistry Researcher

**Columbia University** — Dec 2025–Present

- Developed ChemAgent-QSM, an LLM-guided agentic framework converting natural-language chemistry prompts into validated PySCF quantum-chemical pipelines for drug-like molecules.
- Generated auditable Python workflows for time-correlation functions, local-order metrics, relaxation timescales, mobility fields, structure–dynamics coupling, optimized geometries, electronic-structure descriptors, and vibrational spectra via ab initio DFT.
- Developed LLM-trajectory features and machine-learning workflows for dynamical heterogeneity in glass-forming and related systems using mean-squared displacement, SISFs, and MSCOPE baselines.

### Project Co-Lead — Deep Reinforcement Learning for Antibody–Antigen Interactions

**AI@MIT / AIM Labs** — Jan 2026–Present

- Co-led a six-person team developing a structure-informed cross-attention transformer and ESM-2 pipeline that maps protein/pathogen sequences to candidate antibodies using OAS, SAbDab, and IEDB datasets.
- Reduced training time by approximately 40% through PPO-based reinforcement learning against AlphaFold-Multimer/IGFold structural metrics using distributed PyTorch DDP on MIT SuperCloud.

### Protein Design Algorithm Engineer — EVEdesign Collaborative Project

**Harvard Medical School; Prof. Marks** — Apr 2026–Present

- Working on EVEdesign's open-source, method-independent protein-design platform as part of a 21-person, 18-institution, 8-country collaboration, supporting composable multi-objective antibody/protein design across evolutionary, structural, developability, and experimental-feedback constraints.
- Developing uncertainty-aware candidate selection, sequence–structure–function objective integration, protein-language-model/evolutionary-prior scoring, and agent-based tool orchestration for scalable lab-in-the-loop biosequence design.

## Additional Experiences

### AI/ML for Statistical Mechanics Simulations Researcher and Teaching Fellow

**MIT Physics · Prof. A. Nihat Berker** — Jan 2022–Present

- Invited to conduct research after ranking in the top 1% of graduate-level 8.334: Phase Transitions and Renormalization-Group Theory while in high school. Building a PyTorch/GNN-augmented Kadanoff renormalization-group framework to identify fixed points and map thermodynamic phase boundaries in spin-1/2 antiferromagnetic systems.
- Mentored 200+ students regarding college applications, decisions, and career paths while teaching condensed Augmented Chemistry and Classical/Quantum Mechanics courses and grading daily problem sets and exams.

### Kupcinet-Getz Scholar in Computational Biochemical Diffusion

**Weizmann Institute of Science** — Jun–Aug 2025

- Selected as one of 22 scholars worldwide with an acceptance rate below 10%; developed PINN- and neural-ODE-enhanced stochastic simulation of nonequilibrium enzyme reaction-diffusion networks and custom Euler-Maruyama, Runge-Kutta, and Gillespie SSA solvers for biochemical kinetics and spatial heterogeneity.
- Constructed GNN encoders, transformer sequence models, UMAP-driven clustering, and PyTorch classifiers to extract latent thermal structure, identify bifurcations, and classify nonlinear dynamics from high-dimensional trajectories.

### Chemistry and AI Consultant and Scientific Data and Evaluation Specialist

**Sepal AI, Mercor** — Sept 2024–Feb 2025

- Developed model-training, testing, and evaluation data for LLM workflows that convert graduate-level retrosynthesis, reaction-mechanism, and method-selection problems into tasks that can be checked against known solutions; built grading rubrics and chemical-validity constraints.
- Developed instructional data, prompt-engineering workflows, error analysis, decomposition, and failure-mode annotation for advanced chemistry reasoning, converting the work into instruction/response, evaluation/grading, and feedback formats for training and benchmarking.

### Foundation Research Scholar in Computational Organic Chemistry

**Lumiere Research Inclusion Foundation** — Aug 2023–Feb 2024

- Engineered an automated multi-scale simulation pipeline linking DFT calculations to stochastic kinetic Monte Carlo models; screened 20+ transition states and 500+ reaction trajectories across five solvent pathways to achieve a 22% predicted yield optimization for a cytotoxic target.
- Secured a selective full research scholarship and independently drove the computational project with one-to-one Brown University PhD mentorship, analyzing reaction dynamics and compiling a mechanistic manuscript.

### Advanced Organic Synthesis Researcher

**MIT Chemistry; Prof. Stephen L. Buchwald** — Dec 2025–May 2026

- Supported development of a CuH catalyst for selective asymmetric methylation and alkylation of vinyl boronate esters; used 1H-NMR and chiral-HPLC to relate catalyst structure to activity, expanded substrate scope, and scaled synthesis from 0.1 mmol to multi-gram quantities.

### Teaching Fellow and Grader for 6.1200[J]

**MIT EECS — Discrete Mathematics / Mathematics for Computer Science** — Jan 2026–Present

- Selected after receiving an A+ and ranking in the top 1% of MIT EECS's largest foundational theoretical-computer-science course; grades proof-intensive assignments in logic, graph theory, recurrence relations, asymptotic analysis, and cryptography.
- Supports a 250+ student cohort through recitations, office hours, midterms, and finals.

## Personal

- Computer-Aided Drug Discovery skillset: molecular docking; virtual screening; MMGBSA/FEP/free-energy methods; AutoDock Vina; GNINA CNN scoring; Boltz-2 protein–ligand co-folding; QSAR with RF/XGBoost; ADMET/Rowan; Morgan fingerprints; Tanimoto/PAINS/ESOL filtering; BRICS/generative chemistry; onepot/muni catalog screening; PyMOL.
- Additional computational skillset: distributed training; Conda; NumPy; molecular dynamics; OpenMM; OpenFF; OpenFE; MDTraj; ParmEd; PDBFixer; RDKit; SMILES/SDF/PDB/PDBQT; PySCF; SciML; LLM embeddings; sequence modeling; PPO; SQL; Java; MATLAB; LaTeX.
- Languages: English native; Turkish native; German professional; Spanish beginner; Hebrew beginner.
- Interests: philosophy of science, epistemology, logic, metaphysics, psychology, language, history, aesthetics, ethics, politics, power, biopolitics, sociocultural anthropology, Foucauldian studies, love, Judaism, Islam, and queer, postmodern, psychoanalytic, post-structuralist, race, and feminist critical theories.
- Hobbies: modelling, fashion, essay writing, volleyball, competitive Pokémon, figure skating, chess, poker, meditative and labyrinth walking, and FNAF.
