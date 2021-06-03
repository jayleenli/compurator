# Compurator

## Project summary

### A comparison tool that allows you the convenience of adding products you like on the go with a browser extension and the clarity of comparing and contrasting them side-by-side in your online dashboard, making indecisive online shopping a more enjoyable experience.

### Additional information

For those who cannot decide which new computer they'd like to spend their lives' savings on, those who are clueless in picking out tech for themselves, and those who are plainly indecisive, this is now the tool to aid you in making your carefully-weighed monetary decision in purchasing a computer (or something else). Endorsed by Richert, Compurator includes both a web extension and a web app. You can add products into your workspaces through our extension as you browse through Amazon. You can then navigate to our web app and have the products you added listed side-by-side for comparison in your workspace and with additional features like note taking and sentiment analysis on laptop and company reviews. In addition, if you log in with your Google account, all your workspaces and products will be stored for your next visit.


## Installation

### Prerequisites

#### Browser extension
* Node.js
* NPM

#### Web app
* serverless
* AWS account with Lambda set up
* React
* Python3

### Dependencies

#### Browser Extension
* dogescript
* web-ext

#### Web app
* serverless-python-requirements
* serverless-offline-python
* pyMongo

### Installation Steps
* Backend: <https://github.com/ucsb-cs48-w20/4pm-laptops-comparer/blob/master/backend/README.md>
* Frontend: <https://github.com/ucsb-cs48-w20/4pm-laptops-comparer/blob/master/frontend/README.md>

## Functionality
* User can log in with their Google account to have their products and workspaces saved on both the web extension and the web app
* When user is on a product page on Amazon, the user can add the product by selecting a workspace and clicking add on the web extension
* App will webscrape information about product if the product is a laptop and add the information to the workspace such as price, model, laptop, battery type etc.
* User can then navigate to the web app where they can see all their workspaces
* User can select a workspace and all the products stored in the workspace will be displayed by prices for the user to compare them
* User can add notes for a product in their workspace
* User can see a scaled rating of the sentiment analysis of the company that made the laptop and a scaled rating of the overall reviews from external news outlet sites

## Known Problems

* AWS server blocks webscraping on Amazon site
* Local deployment instead of server deployment results in intense lag
* Sentiment analysis takes a while (Up to 30s)

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License
<https://github.com/ucsb-cs48-w20/4pm-laptops-comparer/blob/master/LICENSE.txt>

## Releases:
* Live at https://compare.richert.wang/  
* To download the web extension go to the following link in Firefox and click the .xpi file to download it.  
https://github.com/ucsb-cs48-w20/4pm-laptops-comparer/releases/tag/v1.1  
