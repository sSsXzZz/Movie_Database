import pandas as pd
import sqlalchemy
from sqlalchemy import create_engine
import numpy as np

engine = create_engine('mysql+mysqldb://root:vishnu1@localhost/imdb', echo=False)

data = pd.read_csv('movie_metadata.csv')
data = data.drop(['num_critic_for_reviews','movie_facebook_likes', 'color', 'director_facebook_likes',
                      'actor_3_facebook_likes','actor_2_facebook_likes','actor_1_facebook_likes',
                      'num_voted_users','cast_total_facebook_likes','facenumber_in_poster','movie_imdb_link',
                      'num_user_for_reviews','country','budget','imdb_score','aspect_ratio'], axis=1)

movies = data[['language','title_year','content_rating','movie_title','duration','gross']]
movies = movies.rename(columns={'title_year': 'year', 'gross': 'revenue'})

movies.to_sql('Movies', con=engine, if_exists = 'append', index = False,
                  dtype={'language': sqlalchemy.types.VARCHAR(length=10),
                            'year': sqlalchemy.types.INTEGER(),
                            'content_rating': sqlalchemy.types.VARCHAR(length=10),
                            'movie_title': sqlalchemy.types.VARCHAR(length=90),
                            'duration': sqlalchemy.types.INTEGER(),
                            'revenue': sqlalchemy.types.INTEGER()})
#UPDATE Movies SET movie_title = SUBSTRING(movie_title, 1, CHAR_LENGTH(movie_title) -1);

data['genres'] = data['genres'].astype('str') 
data['plot_keywords'] = data['plot_keywords'].astype('str') 
genres = pd.DataFrame(columns=['name','mid'])
keywords = pd.DataFrame(columns=['keyword','mid'])
actors = pd.DataFrame(columns=['name'])
directors = pd.DataFrame(columns=['name'])
genreindex = 0
keywordindex = 0
actor_items=[]
director_items=[]
for index, row in data.iterrows():
    genre_items = row['genres'].split('|')
    for _ in genre_items:
        genres.loc[genreindex] = [_, index+1]
        genreindex = genreindex+1
    keyword_items = row['plot_keywords'].split('|')
    for _ in keyword_items:
        keywords.loc[keywordindex] = [_, index+1]
        keywordindex = keywordindex+1
    if (row['actor_1_name'] not in actor_items):
        actor_items.append(row['actor_1_name'])
    if (row['actor_2_name'] not in actor_items):
        actor_items.append(row['actor_2_name'])
    if (row['actor_3_name'] not in actor_items):
        actor_items.append(row['actor_3_name'])
    if (row['director_name'] not in director_items):
        director_items.append(row['director_name'])
for i in range(len(actor_items)):
    actors.loc[i] = [actor_items[i]]
for i in range(len(director_items)):
    directors.loc[i] = [director_items[i]]

genres.to_sql('Genres', engine, if_exists = 'append', index = False, 
                  dtype={'name': sqlalchemy.types.VARCHAR(length=20),
                            'mid': sqlalchemy.types.INTEGER()})

keywords.to_sql('Movie_Keywords', engine, if_exists = 'append', index = False, 
                  dtype={'keyword': sqlalchemy.types.VARCHAR(length=105),
                            'mid': sqlalchemy.types.INTEGER()})
                            
actors.to_sql('Actors', engine, if_exists = 'append', index = False, 
                  dtype={'name': sqlalchemy.types.VARCHAR(length=30)})
                          
directors.to_sql('Directors', engine, if_exists = 'append', index = False, 
                  dtype={'name': sqlalchemy.types.VARCHAR(length=35)})

actor_movie = pd.DataFrame(columns=['aid','mid'])
director_movie = pd.DataFrame(columns=['did','mid'])
actor_index = 0
for index, row in actors.iterrows():
    for index2, row2 in data.iterrows():
        if ((row['name'] == row2['actor_1_name']) or (row['name'] == row2['actor_2_name']) 
                or (row['name'] == row2['actor_3_name']) ):
            actor_movie.loc[actor_index] = [index+1, index2+1]
            actor_index = actor_index+1
director_index = 0
for index, row in directors.iterrows():
    for index2, row2 in data.iterrows():
        if ((row['name'] == row2['director_name']) ):
            director_movie.loc[director_index] = [index+1, index2+1]
            director_index = director_index+1

actor_movie.to_sql('Actor_Movie', engine, if_exists = 'append', index = False, 
                  dtype={'aid': sqlalchemy.types.INTEGER(),
                          'mid': sqlalchemy.types.INTEGER()})
                          
director_movie.to_sql('Director_Movie', engine, if_exists = 'append', index = False, 
                  dtype={'did': sqlalchemy.types.INTEGER(),
                          'mid': sqlalchemy.types.INTEGER()})