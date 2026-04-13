import json
import re

with open('data.js', 'r', encoding='utf-8') as f:
    text = f.read()

# For product images
image_replacements = {
    "'s10'": "images/cerave_bottle.png",
    "'s11'": "images/blue_foam_pump.png",
    "'s12'": "images/cerave_bottle.png",
    "'s13'": "images/blue_foam_pump.png",
    "'s14'": "images/minimalist_dropper.png",
    "'s15'": "images/minimalist_dropper.png",
    "'s16'": "images/plum_dropper.png",
    "'s17'": "images/cetaphil_tub.png",
    "'s18'": "images/cerave_bottle.png",
    "'s19'": "images/sunscreen_tube.png",
    "'s20'": "images/sunscreen_tube.png",
    "'s21'": "images/plum_dropper.png",
    "'s22'": "images/minimalist_dropper.png",
    "'s23'": "images/cerave_bottle.png",
    "'s24'": "images/plum_dropper.png",
    "'s25'": "images/cetaphil_tub.png",
    "'s26'": "images/sunscreen_tube.png",
    "'s27'": "images/plum_dropper.png",
    "'s28'": "images/cetaphil_tub.png",
    "'s29'": "images/sunscreen_tube.png",
    "'s30'": "images/plum_dropper.png",
    "'h6'": "images/blue_foam_pump.png",
    "'h7'": "images/cerave_bottle.png",
    "'h8'": "images/minimalist_dropper.png",
    "'h9'": "images/plum_dropper.png",
    "'h10'": "images/minimalist_dropper.png",
    "'h11'": "images/blue_foam_pump.png",
    "'h12'": "images/minimalist_dropper.png",
    "'h13'": "images/plum_dropper.png",
}

# The block from line 204 to 687 is what we want to process.
# Since the python script is simple, let's just do targeted string replacements on the images for those segments.
for id_str, img_path in image_replacements.items():
    # find the block for the given ID
    # example: id: 's10', ..., image: 'images/cleanser_hydrating.png',
    pattern = rf"(id:\s*{id_str}[\s\S]*?image:\s*)'[^']*'"
    text = re.sub(pattern, rf"\1'{img_path}'", text)

# For fixing prices to be realistic and match the priceRange more exactly
# We can also add more strict traits.
# Let's write the modified content back
with open('data.js', 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated images in data.js")
