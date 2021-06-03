from newsapi.newsapi_client import NewsApiClient
from textblob import TextBlob
import requests
import signal
from contextlib import contextmanager


@contextmanager
def timeout(time):
    # Register a function to raise a TimeoutError on the signal.
    signal.signal(signal.SIGALRM, raise_timeout)
    # Schedule the signal to be sent after ``time``.
    signal.alarm(time)

    try:
        yield
    except TimeoutError:
        pass
    finally:
        # Unregister the signal so it won't be triggered
        # if the timeout is not reached.
        signal.signal(signal.SIGALRM, signal.SIG_IGN)


def raise_timeout(signum, frame):
    raise TimeoutError

def calc_sentiment(total_sentiment, num_reviews):
    return (total_sentiment / num_reviews) ** 0.15


def get_amazon_sentiment(asin: str):
    '''
    :param asin: unique amazon ID
    :return: sentiment for all of the reviews as a score between 0 and 1
    '''
    try:
        params = {
            'api_key': 'EA48849892404F45AFB34439886B80CE',
            'amazon_domain': 'amazon.com',
            'type': 'reviews',
            'asin': asin,
            'no_cache': 'true'
        }
        headers={"Cache-Control": "no_cache"}

        with timeout(29):

            # make the http GET request to Rainforest API
            api_result = requests.get('https://api.rainforestapi.com/request', params, headers=headers)

            reviews_dict = api_result.json()
            if (reviews_dict != None):

                num_reviews = len(reviews_dict['reviews'])
                total_sentiment = sum(TextBlob(review['body']).sentiment.polarity for review in reviews_dict['reviews'])

                avg_sentiment = calc_sentiment(total_sentiment, num_reviews)
                return avg_sentiment
            else:
                return None

    except Exception as e:
        print(e)
        return None


def get_seller_reputation(seller: str):
    '''
    :param seller: company selling the product
    :return: reputation (sentiment of the company) as a score between 0 and 1
    '''
    try:
        with timeout(6):
            newsapi = NewsApiClient(api_key='79c6973fb6b845569d2ae876fb97b7c6')

            news_results = newsapi.get_everything(q=seller,
                                                  language='en',
                                                  sort_by='relevancy',
                                                  page=1)

            num_articles = len(news_results['articles'])
            total_sentiment = sum(TextBlob(article['content']).sentiment.polarity for article in news_results['articles'])

            avg_sentiment = calc_sentiment(total_sentiment, num_articles)
            return avg_sentiment

    except Exception as e:
        print(e)
        return None


if __name__=='__main__':
    seller = 'Apple'
    print(seller, ':', get_seller_reputation(seller))

    asin = 'B07211W6X2'
    print(asin, 'sentiment :', get_amazon_sentiment(asin))