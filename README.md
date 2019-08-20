# New Private Car Registrations in Ireland
This project is a single-page website containing an interactive data dashboard. The dashboard explores new private car registrations in Ireland from 2008 to 2018.

Topics explored include: (1) new car sales vs used imports, (2) the popularity ranking of car makes, (3) the composition of new car sales by car model, (4) the popularity ranking of car colours, (5) the number of new car sales in each county per head of population.

## Demo
The deployed site can be found [here](https://o-power.github.io/new-car-registrations/) on GitHub Pages.

<img src="/assets/images/deployed_site_screenshot.png" alt="Image of deployed site">

## UX
### Wireframes
Desktop wireframes can be found in the [wireframes](/assets/wireframes) folder.

Mobile wireframes are not included as per the project requirements: "Please note that if you are building a data dashboard, only your chart containers are expected to be responsive. Charts using D3.js are not responsive as they are designed for desktop or large-screen viewing."

### User Stories
* I want to understand the trend in total new car registrations in Ireland.
* I want to understand which car makes have increased/decreased in popularity.
* I want to understand which car models make up the most new car sales.
* I want to understand which car colours have increased/decreased in popularity.
* I want to understand which counties buy the most new cars per head of population.

## Technologies/Libraries
1. HTML
2. CSS
3. JavaScript
4. [Bootstrap](https://getbootstrap.com/) was used to manage the layout of the site.
5. [D3](https://d3js.org/) was used to build the charts. DC.js and Crossfilter.js were not used as it was easier to find examples for the chart types needed (treemap, bump chart, map) in D3.js.
6. [TopoJSON](https://github.com/topojson/topojson) was used to map the counties of Ireland. It has a smaller file size than GeoJSON.
7. [GitHub](https://github.com/) was used for source control and deployment.
8. [AWS Cloud](https://aws.amazon.com/cloud9/) was used as the development environment for the project.
9. [Alteryx Designer](https://www.alteryx.com/) was used to prepare the data. Alteryx Designer is a drag-and-drop tool for rapid data preparation.
10. [Gimp](https://www.gimp.org) was used to reduce the file size of the car logos for the bump chart.
11. [Material Icons](https://material.io/resources/icons/?style=baseline) were used in the Data Sources section as bullet icons.

## Features
### Existing
* A stacked chart with a custom legend.
* Bump charts which are a combination of a line chart and circles.
* SVG patterns which are used to display the car logos in the car makes bump chart.
* An SVG linear gradient which is used to display a multi-coloured circle in the car colours bump chart.
* A treemap which is an example of a D3.js hierarchy chart. The data was prepared in JSON format for the chart.
* A map of Ireland which is an example of a TopoJSON chart.
* Tooltips on all the charts which allow the user to explore the data.
* A data sources section which uses Material Icons.
* A shortcut icon.

### Future
* The functions which build the charts could be made more generic and so reusable.
* The charts could be made responsive by using the [viewBox attribute](https://medium.com/@louisemoxy/a-simple-way-to-make-d3-js-charts-svgs-responsive-7afb04bc2e4b).
* Additional charts could be added to examine the trends in body type (MPV, hatchback etc) and engine type (electric, petrol etc).
* Get the charts to display in Internet Explorer 11.

## Data Preparation
Data for each year was downloaded separately from [stats.beepbeep.ie](https://stats.beepbeep.ie/). Alteryx Designer was used to combine and clean the data. For the car colours data the multi-coloured category was substituted for any colour category containing the word "and".

The treemap required the data to be in a JSON format with the necessary hierarchial structure. Alteryx Designer was used to build this hierarchy and to convert the data from CSV to JSON.

## Testing
### General Testing
During development, the Chrome DevTools console was used regularly to log the data to ensure that it was being correctly manipulated by the D3.js functions.

The HTML was checked using the [W3C Markup Validation Service](https://validator.w3.org/). This identified an incorrectly used paragraph element.

The CSS was checked using the [W3C CSS Validation Service](https://jigsaw.w3.org/css-validator/). This returned one error which said the property "r" does not exist. However, "r" is a property of the circle svg.

The website was tested on Chrome and Firefox. As the project requirements do not require a data dashboard to be responsive, it was just tested that the website loaded on mobile devices.

The website was also tested on Internet Explorer 11. The charts did not display in this browser.

The links in the Data Sources section were checked to ensure they were working and opening in new tabs.

The data was checked against the tables in [stats.beepbeep.ie](https://stats.beepbeep.ie/).

### User Story Testing
* _I want to understand the trend in total new car registrations in Ireland._
  The stacked area chart shows the trend in total new car registrations in Ireland. It also shows how the downward trend in recent years may be attributed to the increase in used car imports.
* _I want to understand which car makes have increased/decreased in popularity._
  The bump chart with the car logos shows how the ranking of the different car makes has changed. It easily allows the user to compare the time evolution of a relatively large number of categories (the top 10 car makes).
* _I want to understand which car models make up the most new car sales._
  The treemap shows new car sales by every make and model. Although overwhelming at first, it has the advantage of not hiding any information. The user can explore the details using the tooltips.
* _I want to understand which car colours have increased/decreased in popularity._
  The bump chart with the car colours shows how the ranking of the different car colours has changed. Again, it easily allows the user to compare the time evolution of a relatively large number of categories (16 colours).
* _I want to understand which counties buy the most new cars per head of population._
  The map shows the number of new car sales per 100 adults in each county.

## Deployment
The project was developed on AWS Cloud9. A repository was created on GitHub and regular commits were made.

The project was then deployed using GitHub pages. It is deployed directly from the master branch. The deployed site will update automatically upon new commits to the master branch. In order for the site to deploy correctly on GitHub pages, the landing page must be named index.html.

To deploy the project on GitHub pages, the following steps were followed.
1. Log into Github
2. Select the repository o-power/new-car-registrations.
3. Select the Settings tab.
4. Scroll down to the section called GitHub Pages.
5. Under Source, select master branch from the dropdown.
6. The page will refresh and a message will appear in the GitHub Pages section saying "Your site is published at https://o-power.github.io/new-car-registrations/".
7. It may take several minutes before the deployed site is ready to be viewed.

To run locally, clone this repository directly into the editor of your choice by pasting `git clone https://github.com/o-power/new-car-registrations.git` into your terminal. To cut ties with this repository, type `git remote rm origin` into the terminal.

## Credits
### Content
* New private car registrations data was taken from [stats.beepbeep.ie](https://stats.beepbeep.ie/) [accessed 29th July 2019].
* Used imports data was taken from [CSO Statbank table TEA01](https://www.cso.ie/px/pxeirestat/Statire/SelectVarVal/Define.asp?Maintable=TEA01&Planguage=0) [accessed 17th August 2019].
* Census 2016 population by county was taken from [CSO Statbank E2001](https://www.cso.ie/px/pxeirestat/Statire/SelectVarVal/Define.asp?Maintable=E2001&Planguage=0) [accessed 17th August 2019].
* The TopoJSON file for the Republic of Ireland was taken from [David Eldersveld's TopoJSON Collection](https://github.com/deldersveld/topojson) [accessed 18th August 2019]. The county Laoighis was renamed Laois to match the Census county name.

### Media
* Car logos were taken from [stickpng.com](https://www.stickpng.com/) [accessed 16th August 2019].
* The shortcut icon was taken from [Font Awesome](https://fontawesome.com/license) [accessed 17th August 2019].

### Acknowledgements
* Stacked area chart is adapted from [D3.js Graph Gallery](https://www.d3-graph-gallery.com/graph/stackedarea_basic.html) [accessed 17th August 2019].
* Colour legend on stacked area chart is adapted from [D3.js Graph Gallery](https://www.d3-graph-gallery.com/graph/custom_legend.html) [accessed 17th August 2019].
* Bump chart is adapted from Chas Jhin's example on [https://bl.ocks.org](http://bl.ocks.org/cjhin/b7a5f24a0853524414b06124c559961a) [accessed 17th August 2019].
* Adding images using patterns was adapted from Jonathan Soma's [Using images in D3 bubble charts, Part 2 (SVG defs/images in d3)](https://www.youtube.com/watch?v=FUJjNG4zkWY) [accessed 17th August 2019].
* Treemap is adapted from [D3.js Graph Gallery](https://www.d3-graph-gallery.com/graph/treemap_custom.html) [accessed 17th August 2019].
* Shortcut icon generated using [Favicon Generator](https://realfavicongenerator.net/) [accessed 17th August 2019].
* Using a bump chart to compare the popularity of car colours was inspired by [Sir Viz-a-Lot's example using US car sales](https://www.sirvizalot.com/2016/03/color-popularity-for-new-cars-2000-2015.html) [accessed 17th August 2019].
* The map was adapted from Mike Bostock's example on [https://bl.ocks.org](https://bl.ocks.org/mbostock/4122298). The labels were added using ideas from the [D3.js Graph Gallery](https://www.d3-graph-gallery.com/graph/choropleth_basic.html) and a [TopoJSON map of Ireland with cities](https://codepen.io/robjoeol/pen/qKReXy) [accessed 18th August 2019].
