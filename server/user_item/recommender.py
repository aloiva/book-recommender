from cmath import log
from operator import le
import pandas as pd
import logging
import sqlite3

logging.basicConfig(level=logging.DEBUG)

conn = sqlite3.connect('recommender.db')


class user_item_recommender:
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
    
    ratings = pd.read_sql_query("SELECT * from ratings", conn)
    ratings.rename(columns = {'user_id': 'User-ID',
                              'isbn': 'ISBN',
                              'book_rating': 'Book-Rating'
                            }, inplace = True)
    books = pd.read_sql_query("SELECT * from books", conn)
    books.rename(columns = {'isbn': 'ISBN', 
                            'book_title': 'Book-Title', 
                            'book_author': 'Book-Author',
                            'year_of_publication': 'Year-Of-Publication',
                            'publisher': 'Publisher',
                            'image_url_s': 'Image-URL-S', 
                            'image_url_m': 'Image-URL-M',
                            'image_url_l': 'Image-URL-L'}, inplace = True)
    dataset['User-ID'] = dataset['User-ID'].astype(int)
    def __init__(self):
        pass

    # def generateBookMatrix(self, df):
    #     df_ = df[df['Book-Rating'] > 0]
    #     book_rating = pd.DataFrame(df_['Book-Title'].value_counts())
    #     sparse_books = book_rating[book_rating['Book-Title'] <= 75].index
    #     common_books = df_[~df_["Book-Title"].isin(sparse_books)]
    #     userMatrix = common_books.pivot_table(index=['User-ID'], columns=['Book-Title'], values='Book-Rating')
    #     return userMatrix

    # def generateUserDataFrame(userID, user_book_matrix):
    #     df = user_book_matrix[user_book_matrix.index == userID]
    #     return df

    def recommend(self, userID=int('137892'), df=dataset, ratings=ratings, books=books):
        df_ = df[df['Book-Rating'] > 0]
        book_rating = pd.DataFrame(df_['Book-Title'].value_counts())
        sparse_books = book_rating[book_rating['Book-Title'] <= 55].index
        common_books = df_[~df_["Book-Title"].isin(sparse_books)]
        user_book_matrix = common_books.pivot_table(index=['User-ID'], columns=['Book-Title'], values='Book-Rating')
        print(user_book_matrix)
        #user_book_matrix = self.generateBookMatrix(dataset)
        user_dataFrame = user_book_matrix[user_book_matrix.index == userID]
        print(user_dataFrame.head(5))
        user_books = user_dataFrame.columns[user_dataFrame.notna().any()].tolist()
        read_books = user_book_matrix[user_books]
        user_book_count_df = read_books.T.notnull().sum().reset_index()
        user_book_count_df.columns = ['User-ID','Count']   
        same_readers_with_user = user_book_count_df[user_book_count_df['Count'] > 3]['User-ID']

        rec_df = pd.concat([read_books[read_books.index.isin(same_readers_with_user)],user_dataFrame[user_books]])
        
        correlation_df = rec_df.T.corr().unstack().sort_values(ascending=False).drop_duplicates()
        correlation_df = pd.DataFrame(correlation_df,columns=['correlation'])
        correlation_df.index.names = ['User-ID-1','User-ID-2']
        correlation_df = correlation_df.reset_index()

        #print(correlation_df.head(5))

        similar_users = correlation_df[(correlation_df['correlation'] >= 0.60) & (correlation_df['User-ID-1'] == userID)][['User-ID-2','correlation']]
        similar_users = similar_users.reset_index(drop=True)
        similar_users.rename(columns={'User-ID-2':'User-ID',
                                'correlation':'Correlations'}, inplace=True)
        #print(similar_users.head(10))

        temp_df = similar_users.merge(ratings, how='inner', on='User-ID')
        similar_users_df = temp_df.merge(books, how='inner', on='ISBN')
        similar_users_df = similar_users_df[similar_users_df['User-ID'] != userID]

        # Calculation Weighted Score
        similar_users_df['Weighted Score'] = (0.4 * similar_users_df['Correlations'] + 0.6 * (similar_users_df['Book-Rating'] / 10)) / 2
        
        similar_users_df.sort_values(by='Weighted Score',ascending=False)
        similar_users_df.groupby('User-ID').agg({'Weighted Score':'mean'})
        recommendation_df = similar_users_df.groupby('Book-Title').agg({'Weighted Score':'mean'}).reset_index()
        print(recommendation_df)
        recommendation_df_by_score = recommendation_df[recommendation_df["Weighted Score"] > 0.30].sort_values(by='Weighted Score',ascending=False)
        recommendation_df_by_score = recommendation_df_by_score.merge(books, how='inner',on='Book-Title')

        recommended_list = recommendation_df_by_score.sort_values(by='Weighted Score',ascending=False).drop_duplicates(subset='Book-Title').head(15).to_dict()
        logging.debug(recommended_list)
        #test = books.head(10).sort_values(by='Book-Title').to_dict()
        #logging.debug(test)
        return recommended_list


    # for i in range (13700, 15000):
    #     print(recommend(int(i)))

    #print(recommend(int('153562')))