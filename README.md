# New Private Car Registrations in Ireland 
Dashboard showing passenger car registrations in Ireland from 2010 to 2018.

## Demo
A live demo can be found here on Github Pages.
Add screenshots.

## UX
### Wireframes
Wireframes can be found in the wireframes folder.
Desktop and mobile wireframes.
### User Stories

## Technologies/Libraries
1. HTML
2. CSS
3. Flexbox
4. JavaScript
5. D3
6. AWS Cloud9
7. GitHub
8. Alteryx Designer

## Features
### Existing
### Future
* The functions which build the charts could be made more generic and so reusable.

## Data Preparation
Data for each year was downloaded separately from https://stats.beepbeep.ie/.
Alteryx Designer was used to combine the data for different years.
The treemap required the data to be in a JSON format and Alteryx Designer was used to convert the data from CSV to JSON with the necessary hierarchial structure.

## Testing
The HTML was checked using the W3C Markup Validation Service.

The CSS was checked using the W3C CSS Validation Service.

The website was tested during development on different screen sizes and devices using Chrome DevTools. The website was also tested on a Samsung A5, a 15 inch laptop and a widescreen monitor.

JavaScript Validation Service.

Different browsers.

All the links were checked to ensure they were working.

Bugs and fixes.

## Deployment
The site is hosted using GitHub pages and is deployed directly from the master branch. The deployed site will update automatically upon new commits to the master branch. In order for the site to deploy correctly on GitHub pages, the landing page must be named index.html.

To run locally, clone this repository directly into the editor of your choice by pasting git clone https://github.com/o-power/xxxxxx.git into your terminal. To cut ties with this repository, type git remote rm origin into the terminal.

## Credits
### Content
* New private car registrations data was taken from [beepbeep.ie](https://stats.beepbeep.ie/) [accessed 29th July 2019].
* Used imports data was taken from [CSO Statbank table TEA01](https://www.cso.ie/px/pxeirestat/Statire/SelectVarVal/Define.asp?Maintable=TEA01&Planguage=0) [accessed 17th August 2019].
* Census 2016 population by county was taken from [CSO Statbank E2001](https://www.cso.ie/px/pxeirestat/Statire/SelectVarVal/Define.asp?Maintable=E2001&Planguage=0) [accessed 17th August 2019].

### Media
* Car logos were taken from [stickpng.com](https://www.stickpng.com/) [accessed 16th August 2019].
* The shortcut icon was taken from [Font Awesome](https://fontawesome.com/license) [accessed 17th August 2019].

### Acknowledgements
* Stacked area chart is adapted from [D3.js Graph Gallery](https://www.d3-graph-gallery.com/graph/stackedarea_basic.html) [accessed 17th August 2019].
* Colour legend on stacked area chart is adapted from [D3.js Graph Gallery](https://www.d3-graph-gallery.com/graph/custom_legend.html) [accessed 17th August 2019].
* Bump chart is adapted from Chas Jhin's example on [https://bl.ocks.org](http://bl.ocks.org/cjhin/b7a5f24a0853524414b06124c559961a) [accessed 17th August 2019].
* Adding images using patterns was adapted from Jonathan Soma's [Using images in D3 bubble charts, Part 2 (SVG defs/images in d3)](https://www.youtube.com/watch?v=FUJjNG4zkWY) [accessed 17th August 2019].
* Treemap is adapted from [D3.js Graph Gallery](https://www.d3-graph-gallery.com/graph/treemap_custom.html) [accessed 17th August 2019].
* Shortcut icon generated using [Favicon Generator](https://realfavicongenerator.net/) [accessed 3rd May 2019].
