import re
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import sqlite3 
import json
import pandas as pd
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from user_item import recommender
#from item import item_recommender
user_item = recommender.user_item_recommender()
#item_item = item_recommender.item_item_recommender()

# DATABASE_URL = "sqlite:///./recommender.db"
# database = databases.Database(DATABASE_URL)

# metadata = sqlalchemy.MetaData()

 
class Item(BaseModel):
    Book_Title: str
    Weighted_Score: str
    ISBN: str
    Book_Author: str
    Year_Of_Publication: str
    Publisher: str
    Image_URL_S: str
    Image_URL_M: str
    Image_URL_L: str

class Rating(BaseModel):
    userID: int
    isbnValue: str 
    userRating: int
    

app = FastAPI()

# origins_regex = re.compile(r"((http|https)\:\/\/)?[a-zA-Z0-9\.\/\?\:@\-_=#]+\.([a-zA-Z]){2,6}([a-zA-Z0-9\.\&\/\?\:@\-_=#])*")
origins = ['*']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST", "GET"],
		allow_headers=["*"],
    max_age=3600,
)


@app.get("/user-item/{user_id}")
async def user_item_recommender(user_id: int):
    item = jsonable_encoder(user_item.recommend(user_id))
    keys_ = item['Book-Title'].keys()
    item_list = []
    for item_key in keys_:
        name = item['Book-Title'][item_key]
        isbn = item['ISBN'][item_key]
        author = item['Book-Author'][item_key]
        published = item['Year-Of-Publication'][item_key]
        publisher = item['Publisher'][item_key]
        small_icon = item['Image-URL-S'][item_key]
        medium_icon = item['Image-URL-M'][item_key]
        large_icon = item['Image-URL-L'][item_key]
        temp_item = {}
        temp_item[name] = { 
            "title": name,
            "ISBN": isbn, 
            "Author": author, 
            "Published": published,
            "Publisher": publisher,
            "small_icon": small_icon,
            "medium_icon": medium_icon,
            "large_icon": large_icon
        }
        item_list.append(temp_item[name])

    new_item_dict= dict({"books": item_list})
    # print(new_item_dict)
    json_compatible_item_data = jsonable_encoder(new_item_dict)
    return JSONResponse(content=json_compatible_item_data)
 
@app.post("/rate/")
async def createPostRequest(item: Rating):
    conn = sqlite3.connect('recommender.db')
    c = conn.cursor()
    userID = item.userID
    isbnValue = item.isbnValue 
    userRating = item.userRating
    #establish_connection()
    #time.wait(1)
    q_list = fetchQueryData(userID, isbnValue, userRating)
    # print(q_list)
    query_1 = "{}".format(q_list[0])
    query_2 = "{}".format(q_list[1]) 
    conn.commit()
    conn.close()
    return("Success")
    

def fetchQueryData(userID: int, isbnValue: str, userRating: int):
    conn = sqlite3.connect('recommender.db')
    c = conn.cursor()
    x = c.execute(f"SELECT book_title, book_author, year_of_publication, publisher FROM books WHERE isbn='{isbnValue}'").fetchmany()
    book_title, book_author, published, publisher = x[0][0], x[0][1], x[0][2], x[0][3]
    
    y = c.execute(f'''SELECT location, age FROM users WHERE user_id is {userID}''').fetchone()
    location, age = y[0][1], y[0][1]

    query_ratings = f'''INSERT INTO ratings(user_id, isbn, book_rating) VALUES('{userID}','{isbnValue}',{userRating})'''
    query_final = f'''INSERT INTO final(isbn, book_title, book_author, year_of_publication, publisher, user_id, book_rating, location, age)
                        values('{isbnValue}', '{book_title}','{book_author}', {published}, '{publisher}', {userID}, {userRating}, '{location}', {age})'''
    query_ratings = f"INSERT INTO ratings(user_id, isbn, book_rating) VALUES('{userID}','{isbnValue}',{userRating})"
    #print(query)
    query_final = f"INSERT INTO final(isbn, book_title, book_author, year_of_publication, publisher, user_id, book_rating, location, age) values('{isbnValue}', '{book_title[0]}', '{book_author}', {published}, '{publisher}', {userID}, {userRating}, '{location}', {age})"
    #print(query)
    conn.close()
    return [query_ratings, query_final]


# Function to find all books the user has rated, where ratings > 0
@app.get("/rated/{user_id}")
async def findRated(user_id: int):
    conn = sqlite3.connect('recommender.db')
    c = conn.cursor()
    item_list = []
    p = c.execute(f"SELECT isbn, book_rating FROM ratings WHERE user_id is {user_id} and book_rating > 0").fetchall()
    #print(p)
    for item in p:
        # print(item)
        temp_item = {'isbn': item[0], 'rating': item[1]}
        item_list.append(temp_item)
    new_item_dict= dict({"result": item_list})
    conn.close()
    json_compatible_item_data = jsonable_encoder(new_item_dict)
    return JSONResponse(content=json_compatible_item_data)

# Function to specifically search 
@app.get("/rated/{user_id}/{isbn}")
async def findRated(user_id: int, isbn: str):
    conn = sqlite3.connect('recommender.db')
    c = conn.cursor()
    item_list = []
    p = c.execute(f"SELECT isbn, book_rating FROM ratings WHERE user_id is {user_id} and book_rating > 0").fetchall()
    #print(p)
    for item in p:
        # print(item)
        if item[0] == isbn:
            temp_item = {'isbn': item[0], 'rating': item[1]}
            item_list.append(temp_item)
    new_item_dict= dict({"result": item_list})
    conn.close()
    json_compatible_item_data = jsonable_encoder(new_item_dict)
    return JSONResponse(content=json_compatible_item_data)
    
#gets all books
@app.get("/books/{page}")
async def get_books(page: int = 1):
    df = pd.read_csv(r"./assets/Books.csv", skiprows=(page - 1) * 40, nrows=40)
    df.columns = [
        "ISBN",
        "BookTitle",
        "BookAuthor",
        "YearOfPublication",
        "Publisher",
        "ImageURLS",
        "ImageURLM",
        "ImageURLL",
    ]
    result = df.to_json(orient="records")
    return json.loads(result)




