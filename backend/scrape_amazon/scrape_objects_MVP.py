import requests
from bs4 import BeautifulSoup
import re

# user-agent request header
# docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent
HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}


def get_attributes(url):
    '''
    :param url: product url from amazon
    :return: dictionary with item title, price, and id
    '''
    response = requests.get(url, headers=HEADERS)
    soup = BeautifulSoup(response.content, 'lxml')

    title = get_title(soup)
    price = get_price(soup)
    item_id = get_id(url)

    return {
        'title': title,
        'price': price,
        'p_id': item_id
    }


def get_title(soup):
    '''
    :param soup: object containing HTML that is parsed
    :return: product title (up to the first , or ( or | character
    '''
    title = soup.find(id="productTitle")

    if title is None:
        return None

    title = str(title.get_text().strip())
    title = re.search(r'.+?(?=[,(|])', title).group(0)
    return title


def get_price(soup):
    '''
    :param soup: object containing HTML that is parsed
    :return: most probable price (using heuristics)
    NOTE: price will vary! max deviation seems to be ~$100 so far
    '''
    html_prices = list()

    price = soup.find(class_="priceBlockBuyingPriceString")
    html_prices.append(price)
    deal = soup.find(id="priceblock_dealprice")
    html_prices.append(deal)
    item_id = soup.find(id="priceblock_ourprice")
    html_prices.append(item_id)

    html_prices = list(filter(None, html_prices))

    for idx, html in enumerate(html_prices):
        if len(html) == 0:
            continue
        html_prices[idx] = html.get_text()

    # print(html_prices)

    return max(set(html_prices), key=html_prices.count)


def get_id(url):
    '''
    :param url: product url on amazon
    :return: item id based on either dp or gp

    amazon url info: http://www.newselfpublishing.com/AmazonLinking.html
    '''
    def remove_end_slash(item_id):
        if item_id[-1] == '/':
            return item_id[:-1]
        return item_id

    if url.find('/dp/') >= 0:
        item_id = re.search(r'/dp/\w+[/$?]', url).group(0)
        return remove_end_slash(item_id[len('/dp/'):])

    if url.find('/gp/') >= 0:
        item_id = re.search(r'/gp/product/\w+[/$?]', url).group(0)
        return remove_end_slash(item_id[len('/gp/product/'):])

    return None
