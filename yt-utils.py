import requests
from bs4 import BeautifulSoup

r = requests.get("https://www.youtube.com/watch?v=4oT-dRh6bWk")
soup = BeautifulSoup(r.text, features="html.parser")

link = soup.find_all(name="title")[0]
print(link.text)
# title = str(link)
# title = title.replace("<title>","")
# title = title.replace("</title>","")

# print(title)