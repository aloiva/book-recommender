#!/usr/bin/env python
# coding: utf-8

# In[1]:


# Importing Libraries
import pandas as pd
import sqlite3
# Adjusting pandas dataframe settings
pd.set_option('display.max_columns', 500)
# Reading Dataframes
books = pd.read_csv("./assets/Books.csv", low_memory='False')
ratings = pd.read_csv('./assets/Ratings.csv', low_memory='False')
users = pd.read_csv("./assets/Users.csv", low_memory='False')


# In[2]:


print(books.columns)


# In[3]:


# Make connection with the database
conn = sqlite3.connect('reccomender.db')
c = conn.cursor()


# In[4]:


# make final dataframe for final thingie
temp_df = books.merge(ratings, on='ISBN')
final_df = temp_df.merge(users, on='User-ID')
final_df.shape


# In[5]:


#rename the columns in the ratings file for sqlite3 support
ratings.rename(columns = {'User-ID': 'user_id',
                              'ISBN': 'isbn',
                              'Book-Rating': 'book_rating'
                            }, inplace = True)
ratings.head()


# In[6]:


#rename the columns in the books file for sqlite3 support
books.rename(columns = {'ISBN': 'isbn', 
                            'Book-Title': 'book_title', 
                            'Book-Author': 'book_author',
                            'Year-Of-Publication': 'year_of_publication',
                            'Publisher': 'publisher',
                            'Image-URL-S': 'image_url_s', 
                            'Image-URL-M': 'image_url_m',
                            'Image-URL-L': 'image_url_l'}, inplace = True)
books.head()


# In[7]:


#rename the columns in the users file for sqlite3 support
users.rename(columns = {'User-ID': 'user_id', 
                            'Location': 'location', 
                            'Age': 'age'
                        }, inplace = True)
users.head()


# In[13]:


#rename the columns in the final_df file for sqlite3 support
final_df.rename(columns = {'ISBN': 'isbn',
                           'Book-Title': 'book_title',
                           'Book-Author': 'book_author',
                           'Year-Of-Publication': 'year_of_publication',
                           'Publisher': 'publisher', 
                           'User-ID': 'user_id',
                           'Book-Rating': 'book_rating',
                           'Location': 'location',
                            'Age': 'age'}, inplace = True) 
final_df.head()


# In[14]:


#drop the useless unamed columns at the begining
users.drop(users.columns[users.columns.str.contains('unnamed',case = False)],axis = 1, inplace = True)
final = final_df.drop(final_df.columns[final_df.columns.str.contains('unnamed',case = False)],axis = 1, inplace = True)
final = final_df.drop(['Image-URL-S', 'Image-URL-M', 'Image-URL-L'], axis = 1, inplace = True) # dropping these because
                       # we dropped these in our reccomender system as well
ratings.drop(ratings.columns[ratings.columns.str.contains('unnamed',case = False)],axis = 1, inplace = True)
print(final_df.columns)


# In[15]:


# Delete any tables accidently created
# Donot run if tables haven't been created
c.execute('''DROP TABLE users''') 
c.execute('''DROP TABLE final''')
c.execute('''DROP TABLE books''')
c.execute('''DROP TABLE ratings''')


# In[16]:


#print(c.execute('''SELECT * FROM sqlite_schema''').fetchmany())
# Create new tables for each dataframe
c.execute('''CREATE TABLE users (user_id int,location text, age int)''') 
c.execute('''CREATE TABLE books (isbn text,book_title text,book_author text,year_of_publication text,publisher text,image_url_s text,image_url_m text,image_url_l text)''')
c.execute('''CREATE TABLE ratings (user_id int,isbn text, book_rating int)''')
c.execute('''CREATE TABLE final (isbn text, book_title text, book_author text, year_of_publication int, publisher text, user_id int, book_rating int, location text, age int)''')


# In[17]:


# import all the data to our sql thing
ratings.to_sql('ratings', conn, if_exists='append', index=False)
final_df.to_sql('final', conn, if_exists='append', index=False)
books.to_sql('books', conn, if_exists='append', index=False)
users.to_sql('users', conn, if_exists='append', index=False)


# In[18]:


#reading the dataset
# values columns are changed only becuase they are required in the same name for our reccomender
dataset = pd.read_sql_query("SELECT * from final", conn)
dataset.rename(columns = {'isbn': 'ISBN', 
                          'book_title': 'Book-Title', 
                          'book_author': 'Book-Author',
                          'year_of_publication': 'Year-Of-Publication',
                          'publisher': 'Publisher',
                          'image_url_s': 'Image-URL-S', 
                          'image_url_m': 'Image-URL-M', 
                          'image_url_l': 'Image-URL-L', 
                          'user_id': 'User-ID',
                          'book_rating': 'Book-Rating',
                          'location': 'Location',
                          'age': 'Age'
                         }, inplace = True)
dataset['User-ID'] = dataset['User-ID'].astype(int)
dataset.head()


# In[19]:


ratings = pd.read_sql_query("SELECT * from ratings", conn)
ratings.rename(columns = {'user_id': 'User-ID',
                          'isbn': 'ISBN',
                          'book_rating': 'Book-Rating'
                        }, inplace = True)
ratings.head()


# In[20]:


books = pd.read_sql_query("SELECT * from books", conn)
books.rename(columns = {'isbn': 'ISBN', 
                        'book_title': 'Book-Title', 
                        'book_author': 'Book-Author',
                        'year_of_publication': 'Year-Of-Publication',
                        'publisher': 'Publisher',
                        'image_url_s': 'Image-URL-S', 
                        'image_url_m': 'Image-URL-M',
                        'image_url_l': 'Image-URL-L'}, inplace = True)

books.head()


# In[21]:


# function for making queries adding stuff to the database
def establish_connection():
    conn = sqlite3.connect('reccomender.db')
    c = conn.cursor()

def fetchQueryData(userID: int, isbnValue: str, userRating: int):
    book_title = c.execute(f"SELECT book_title FROM books WHERE isbn='{isbnValue}'").fetchmany()
    book_title = book_title[0]
    publisher = c.execute(f"SELECT publisher FROM books WHERE isbn='{isbnValue}'").fetchone()
    publisher = publisher[0]
    published = c.execute(f"SELECT year_of_publication FROM books WHERE isbn='{isbnValue}'").fetchone()
    published = published[0]
    location = c.execute(f'''SELECT location FROM users WHERE user_id is {userID}''').fetchone()
    location = location[0]
    age = c.execute(f'''SELECT age FROM users WHERE user_id is {userID}''').fetchone()
    age = age[0]
    query_ratings = f'''INSERT INTO ratings(user_id, isbn, book_rating) 
                            VALUES('{userID}','{isbnValue}',{userRating})'''
    #print(query)
    query_final = f'''INSERT INTO final(isbn, book_title, book_author, year_of_publication, publisher, user_id, book_rating, location, age)
                        values('{isbnValue}', '{book_title[0]}', {published}, '{publisher}', {userID}, {userRating}, '{location}', {age})'''
    #print(query)
    return [query_ratings, query_final]

async def createPostRequest(userID: int, isbnValue: str, userRating: int):
    establish_connection()
    q_list = fetchQueryData(userID, isbnValue, userRating)
    print(q_list[1])
    c.execute(q_list[1])
    c.execute(q_list[2]) 
    conn.commit()


# In[22]:


createPostRequest(15987, '0195153448', '5')


# In[23]:


print(c.execute(f"SELECT book_rating FROM ratings WHERE isbn is '0195153448' and user_id is 15987").fetchone())


# In[ ]:




