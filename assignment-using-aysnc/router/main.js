module.exports = function(app, request, cheerio, async) {
    app.get('/I/want/title/', myCallback);
    titles = [];
    addresses = [];
    asyncTasks = [];
    /**
     * Handle the get request 
     * @param {onject}req, res,next 
     * @return 
     */
    function myCallback(req, res, next) {
            var queryParam = req.param('address');
            if (typeof(queryParam) !== 'undefined') {
                addresses = getUrlsArray(queryParam);
                addresses.forEach(function(url) {
                    asyncTasks.push(function(callback) {
                        processUrl(url, function(title) {
                            titles.push(title);
                            callback();

                        });
                    });

                });
                /**
                 * Run the all task paralle and after succes call 
                 * @param Array of tasks
                 * @return
                 */
                async.parallel(asyncTasks, function(err) {
                    if (!err) {
                        renderView(req, res, next);
                    } else {
                        console.log(err);
                    }

                });

            } else {
                next();
            }

        }
        /**
         * Make the array of urls from queryParam
         * @param queryParam
         * @return array of addresses
         */
    function getUrlsArray(queryParam) {
            if (queryParam instanceof Array) {

                addresses = queryParam;
            } else {
                addresses.push(queryParam);
            }
            return addresses;

        }
        /**
         * Render the view 
         * @param Http req and res object
         * @return 
         */
    function renderView(req, res, next) {
            res.render('indexs.html', {
                titles: titles
            });
            titles = [];
            addresses = [];
            asyncTasks = [];
        }
        /**
         * Process the url and call the request object
         * @param url
         * @return 
         */
    var processUrl = function(url, callback) {
        var localUrl = url;
        if (localUrl.indexOf('http://') == -1) {
            localUrl = 'http://' + localUrl
        }
        request(localUrl, function(error, response, html) {
            var title;
            if (!error) {
                var $ = cheerio.load(html);
                console.log($("title").text());
                callback(url + " - " + $("title").text());

            } else {
                callback(url + '  NO response');
                console.log(error);
            }
        });

    }

    /**
     * Send response on page not found
     * @param 
     * @return 
     */
    app.get("*", function(request, response) {
        response.end("404!");
    });


}