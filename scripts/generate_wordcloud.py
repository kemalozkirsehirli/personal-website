from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from wordcloud import WordCloud

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public"
PAPER = "#FFF8E7"
FONT = "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf"
BOLD = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"
W, H = 1600, 760

PALETTE = [
    "#7D2B19", "#963824", "#AF4A2E", "#C36440", "#B55D32",
    "#9B6B2F", "#B88936", "#C5A04E", "#8A7041", "#6B7047",
    "#55715D", "#3F6E69", "#455D7A", "#333399", "#5653A0",
    "#6F527E", "#8D566A", "#9D665B", "#6B5B4C", "#4A4A4A",
]

FEATURE_COLORS = {
    "CADD": "#B88936",
    "molecular simulation": "#963824",
    "protein design": "#6F527E",
    "chemical physics": "#C36440",
    "geometric deep learning": "#3F6E69",
    "free-energy methods": "#AF4A2E",
    "biomolecular AI": "#333399",
    "molecular docking": "#B55D32",
    "statistical mechanics": "#455D7A",
    "computational chemistry": "#55715D",
    "drug discovery": "#8D566A",
    "protein foundation models": "#5653A0",
    "molecular dynamics": "#455D7A",
    "virtual screening": "#8D566A",
    "quantum chemistry": "#B88936",
    "mathematical biology": "#3F6E69",
}

# Importance controls scale. The dense tail deliberately fills the interstitial
# spaces, preserving the lively/chaotic character without collisions or a large
# empty band through the center. Every term is rendered horizontally.
FREQUENCIES = {
    "CADD": 100,
    "molecular simulation": 97,
    "protein design": 93,
    "chemical physics": 91,
    "geometric deep learning": 88,
    "free-energy methods": 85,
    "biomolecular AI": 82,
    "molecular docking": 80,
    "statistical mechanics": 77,
    "computational chemistry": 74,
    "drug discovery": 72,
    "protein foundation models": 70,
    "molecular dynamics": 68,
    "chromatin modeling": 66,
    "virtual screening": 64,
    "quantum chemistry": 62,
    "antibody design": 60,
    "target discovery": 58,
    "3D meshes": 57,
    "uncertainty calibration": 55,
    "protein-ligand co-folding": 53,
    "generative models": 52,
    "scientific workflows": 51,
    "renormalization group": 50,
    "stochastic processes": 49,
    "reaction-diffusion": 48,
    "inverse design": 47,
    "sequence modeling": 46,
    "single-cell genomics": 45,
    "structure prediction": 44,
    "robust optimization": 43,
    "scientific inference": 42,
    "AI/ML": 43,
    "free energy": 41,
    "atomistic modeling": 40,
    "systems biology": 39,
    "GNINA": 39,
    "TBXT": 39,
    "AutoDock Vina": 38,
    "mathematical biology": 38,
    "RDKit": 37,
    "diffusion models": 37,
    "ChromoGen V2": 37,
    "PySCF": 36,
    "HPC": 36,
    "OpenMM": 35,
    "GNNs": 35,
    "PRISM": 35,
    "EVEdesign": 35,
    "OpenFE": 34,
    "Transformers": 34,
    "PyTorch": 34,
    "V2M-Engine": 34,
    "Boltz-2": 33,
    "reinforcement learning": 33,
    "ChemAgent-QSM": 32,
    "MMGBSA/FEP": 32,
    "agentic AI": 32,
    "Antibody RL": 32,
    "QSAR": 31,
    "point clouds": 31,
    "ADMET": 30,
    "CUDA": 30,
    "protein safety": 30,
    "electronic structure": 30,
    "BRICS": 29,
    "density functional theory": 29,
    "Monte Carlo": 28,
    "high-performance computing": 28,
    "Kupcinet-Getz": 28,
    "molecular topology": 27,
    "adversarial evaluation": 27,
    "Özkırşehirli Group": 27,
    "sequence-structure-function": 26,
    "retrosynthesis": 26,
    "single-cell foundation models": 26,
    "mechanistic validation": 25,
    "reaction mechanisms": 25,
    "Python": 25,
    "biochemical diffusion": 24,
    "PPO": 24,
    "neural ODEs": 24,
    "LangGraph": 24,
    "MIT CSAIL": 24,
    "protein engineering": 24,
    "PINNs": 23,
    "FastAPI": 23,
    "MIT Chemistry": 23,
    "computable representations": 23,
    "phase transitions": 23,
    "dynamical systems": 22,
    "scientific decision-making": 22,
    "Gillespie SSA": 22,
    "chromatin diffusion": 22,
    "MIT Physics": 22,
    "C/C++": 21,
    "drug-like molecules": 21,
    "immune-state modeling": 21,
    "Euler-Maruyama": 20,
    "Linux": 20,
    "SLURM": 20,
    "Tanimoto": 20,
    "PAINS filters": 20,
    "QTL colocalization": 20,
    "algorithms": 20,
    "testable models": 20,
    "auditable pipelines": 20,
    "molecular surfaces": 20,
    "ESOL": 19,
    "Morgan fingerprints": 19,
    "Perturb-seq": 19,
    "AlphaFold-Multimer": 19,
    "Weizmann Institute": 19,
    "Harvard Medical School": 19,
    "calibration": 19,
    "chemical kinetics": 19,
    "Plate-C": 18,
    "Easy Dip-C": 18,
    "CHARM": 18,
    "A*STAR EDDC": 18,
    "Columbia University": 18,
    "philosophy of science": 18,
    "kinetic Monte Carlo": 18,
    "OAS": 17,
    "SAbDab": 17,
    "IEDB": 17,
    "MIT BioMakers": 17,
    "IGFold": 18,
    "epistemology": 16,
}


def color_func(word, font_size, position, orientation, random_state=None, **kwargs):
    if word in FEATURE_COLORS:
        return FEATURE_COLORS[word]
    x, y = position
    seed = sum((i + 1) * ord(char) for i, char in enumerate(word))
    seed += font_size * 7 + x * 3 + y * 5
    return PALETTE[seed % len(PALETTE)]


# A tight title-shaped exclusion keeps the identifying phrase centered without
# creating a dead rectangle. All remaining space is available to the horizontal packer.
mask_image = Image.new("L", (W, H), 0)
mask_draw = ImageDraw.Draw(mask_image)
mask_draw.rounded_rectangle((445, 332, 1155, 424), radius=8, fill=255)
mask = np.array(mask_image)

cloud = WordCloud(
    width=W,
    height=H,
    background_color=PAPER,
    mask=mask,
    mode="RGB",
    font_path=FONT,
    max_words=len(FREQUENCIES),
    max_font_size=100,
    min_font_size=9,
    prefer_horizontal=1.0,
    relative_scaling=0.34,
    margin=1,
    random_state=19,
    collocations=False,
    repeat=False,
    color_func=color_func,
).generate_from_frequencies(FREQUENCIES)

assert len(cloud.layout_) == len(FREQUENCIES), "Not every word was placed"
assert all(item[3] is None for item in cloud.layout_), "A non-horizontal word was placed"

image = cloud.to_image().convert("RGB")
draw = ImageDraw.Draw(image)
center_font = ImageFont.truetype(BOLD, 112)
draw.text(
    (W // 2, H // 2),
    "AI for Science",
    font=center_font,
    fill="#7D2B19",
    anchor="mm",
)

for destination in (OUT / "word-cloud.png", OUT / "photos" / "wordcloud.png"):
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination, optimize=True)
