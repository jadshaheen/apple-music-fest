# Import necessary libraries
from PIL import Image, ImageDraw, ImageFont

# Set the font and font size
font_size = 125
font = ImageFont.truetype('Eurostile-BoldCondensed', font_size)

# Create a new blank image
# width, height = 600, 200
# image = Image.new('RGB', (width, height), (255, 255, 255))
# draw = ImageDraw.Draw(image)

# Load existing image
image = Image.open('default_background.png')
width, height = image.size
draw = ImageDraw.Draw(image)

# Set the x and y coordinates for the text
x, y = width/20, height/20

# Set the list of artist names
artists = ['Taylor Swift', 'Arctic Monkeys', 'Green Day', 'Glass Animals', 'Chance the Rapper']
# Write each artist name on the image
side = 0
for artist in artists:
  curr_x = x + (side * 10 * x)
  draw.text((curr_x, y), artist, fill=(0, 0, 0), font=font)
  y += height / 10
  side = -(side - 1)

# Save the image
image.save('music_festival_lineup.png')