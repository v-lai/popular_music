# from wikipedia https://en.wikipedia.org/wiki/List_of_best-selling_singles

import requests
import bs4
import csv

r = requests.get('https://en.wikipedia.org/wiki/List_of_best-selling_singles')
soup = bs4.BeautifulSoup(r.text, 'html.parser')


# table_rows = soup.select(".wikitable")[0].select("tr") # use at [0] with csv flag 'w'
# table_rows = soup.select(".wikitable")[10].select("tr") # use from [1-10] with csv flag 'a+'


csv_data = [['artist', 'single', 'released', 'sales']]
for row in table_rows[1:]:
    tds = row.select("td")
    artist = tds[0].text or tds[0].select("a")[0].text
    single = tds[1].select("a")[0].text
    released = tds[2].text
    sales = tds[3].text
    csv_data.append([artist, single, released, sales])

# with open('music.csv', 'a+') as csvfile:
#     writer = csv.writer(csvfile)
#     writer.writerows(csv_data)

# edited csv to remove subscript notes and inconsistent values
