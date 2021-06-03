from scrape_objects_MVP import get_attributes
import json

# test the scraping function from scrape_objects_MVP
# compare with test cases (will not be exact match)
def test_scrape(products_dict):
    for idx, url in enumerate(products_dict):
        print(products_dict[url])
        print(get_attributes(url))
        print('---')

if __name__=='__main__':
    with open('./test_scrape.JSON') as f:
        products_dict = json.load(f)
    test_scrape(products_dict)
