#!/usr/bin/env python3

import time
import json
import redis
import requests as r
from bs4 import BeautifulSoup


domain_url = 'https://www.imdb.com'

top_url = domain_url + '/chart/top/?ref_=nv_mv_250'
popular_url = domain_url + '/chart/moviemeter/?ref_=nv_mv_mpm'
lowest_rated_url = domain_url + '/chart/bottom?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=4da9d9a5-d299-43f2-9c53-f0efa18182cd&pf_rd_r=QCX9EP64XNKR0TN047MB&pf_rd_s=right-4&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_ql_8'

resp = r.get(top_url).text
soup = BeautifulSoup(resp, 'html.parser')

movies_list = []

rd = redis.StrictRedis(host='127.0.0.1', port=9736, db=1)

for title in soup.find_all('td', {'class': 'titleColumn'})[:50]:
    
    title_a = title.find('a')
    movie_url = domain_url + title_a.get_attribute_list('href')[0]
    
    movie_name = title_a.contents[0]
    
    redis_db_response = rd.hgetall(movie_name)
    
    if len(redis_db_response) == 0:

        movie_page_soup = BeautifulSoup(r.get(movie_url).text, 'html.parser')
        
        movie_description = movie_page_soup.find_all('body')[0].find_all('div', {'id': 'wrapper'})[0].find_all('div', {'class':'summary_text'})[0].contents[0].strip()

        poster_page = domain_url + movie_page_soup.find_all('div', {'class':'poster'})[0].find('a').get_attribute_list('href')[0]
        poster_page_soup = BeautifulSoup(r.get(poster_page).text, 'html.parser')
        poster_id = poster_page.split('/')[-1]
        poster_src = poster_page_soup.select('img[data-image-id*="-curr"]')[0].get_attribute_list('src')[0]

        movie_rating = movie_page_soup.find_all('body')[0].find_all('span', {'itemprop': 'ratingValue'})[0].contents[0]

        movie_dict = {
            'name': movie_name,
            'description': movie_description,
            'poster_src': poster_src,
            'movie_url': movie_url,
            'movie_rating': movie_rating
        }

        for k,v in movie_dict.items():
            rd.hset(movie_name, k,v)

        time.sleep(2)

    else:

        movie_dict = {
            'name': redis_db_response[b'name'].decode(),
            'description': redis_db_response[b'description'].decode(),
            'poster_src': redis_db_response[b'poster_src'].decode(),
            'movie_url': redis_db_response[b'movie_url'].decode(),
            'movie_rating': redis_db_response[b'movie_rating'].decode()
        }

    movies_list.append(movie_dict)

for d in movies_list:
    print(json.dumps(d, indent=4, sort_keys=True))
    print('\n')
