function displayRatings(imdbNr) {
  $(".detail:nth-child(2)").before('<div class="plus-rating-container"></div><div class="plus-rating-link-container"></div>');
  $(".plus-rating-container").before('<div class="plus-detailh">Hodnocení<span class="plus-right">TitulkyRating</span></div>');

  $.getJSON("https://www.omdbapi.com/?i=" + imdbNr + "&apikey=2c7f8b02", function (JSONdata) {
    var ratingBg = "plus-rating-none";
    var url;

    if (JSONdata.imdbRating && $.isNumeric(JSONdata.imdbRating)) {
      ratingBg = "plus-rating-blue";
      if (JSONdata.imdbRating >= 7) ratingBg = "plus-rating-red";
      if (JSONdata.imdbRating <= 3) ratingBg = "plus-rating-black";

      url = $("a[target='imdb']").attr("href");
      $(".plus-rating-container").append('<div title="Hodnocení na IMDB" class="plus-rating plus-rating-imdb ' + ratingBg + '"><a href="' + url.replace(/<[^>]*>?/g, "") + '" target="_blank">' + JSONdata.imdbRating.replace(/<[^>]*>?/g, "") + "</a></div>");
      $(".plus-rating-container").append('<div title="IMDB" class="plus-rating-img plus-rating-imdb ' + ratingBg + '"><a href="' + url.replace(/<[^>]*>?/g, "") + '" target="_blank"><img src="' + (-1 !== navigator.userAgent.indexOf("Chrome") ? chrome.runtime : browser.extension).getURL("images/imgimdb.png") + '" alt="IMDB"></a></div>');
      $("a[target='imdb']").find("img").hide();
      $(".plus-rating-link-container").append('<div class="plus-link"><a href="' + url.replace(/<[^>]*>?/g, "") + '" target="imdb"><img src="' + (-1 !== navigator.userAgent.indexOf("Chrome") ? chrome.runtime : browser.extension).getURL("images/imgimdb_sq.png") + '" alt="IMDB.com" title="www.imdb.com"></a></div>');
    }

    ratingBg = "plus-rating-none";
    if (JSONdata.Metascore && $.isNumeric(JSONdata.Metascore)) {
      ratingBg = "plus-rating-blue";
      if (JSONdata.Metascore >= 61) ratingBg = "plus-rating-red";
      if (JSONdata.Metascore <= 39) ratingBg = "plus-rating-black";

      url = "https://www.metacritic.com/search/movie/" + JSONdata.Title + "/results";
      if (JSONdata.Type == "series") {
        url = "https://www.metacritic.com/search/tv/" + JSONdata.Title + "/results";
      }

      $(".plus-rating-container").append('<div title="Hodnocení na MetaCritic" class="plus-rating plus-rating-metacritic ' + ratingBg + '"><a href="' + url.replace(/<[^>]*>?/g, "") + '" target="_blank">' + JSONdata.Metascore.replace(/<[^>]*>?/g, "") + "</a></div>");
      $(".plus-rating-container").append('<div title="MetaCritic" class="plus-rating-img plus-rating-metacritic ' + ratingBg + '"><a href="' + url.replace(/<[^>]*>?/g, "") + '" target="_blank"><img src="' + (-1 !== navigator.userAgent.indexOf("Chrome") ? chrome.runtime : browser.extension).getURL("images/imgmc.png") + '" alt="MetaCritic"></a></div>');
      $(".plus-rating-link-container").append('<div class="plus-link"><a href="' + url.replace(/<[^>]*>?/g, "") + '" target="metacritic"><img src="' + (-1 !== navigator.userAgent.indexOf("Chrome") ? chrome.runtime : browser.extension).getURL("images/imgmc_sq.png") + '" alt="Metacritic.com" title="www.metacritic.com"></a></div>');
    }

    ratingBg = "plus-rating-none";
    var ratingRT = "N/A";
    $(JSONdata.Ratings).each(function (index, value) {
      if (value.Source == "Rotten Tomatoes") {
        ratingBg = "plus-rating-blue";
        ratingRT = value.Value;
        if (parseFloat(value.Value) >= 70) ratingBg = "plus-rating-red";
        if (parseFloat(value.Value) <= 30) ratingBg = "plus-rating-black";
      }
    });

    url = "https://www.rottentomatoes.com/search/?search=" + JSONdata.Title;
    $(".plus-rating-container").append('<div title="Hodnocení na Rotten Tomatoes" class="plus-rating plus-rating-rottentomatoes ' + ratingBg + '"><a href="' + url.replace(/<[^>]*>?/g, "") + '" target="_blank">' + ratingRT.replace(/<[^>]*>?/g, "") + "</a></div>");
    $(".plus-rating-container").append('<div title="Rotten Tomatoes" class="plus-rating-img plus-rating-rottentomatoes ' + ratingBg + '"><a href="' + url.replace(/<[^>]*>?/g, "") + '" target="_blank"><img src="' + (-1 !== navigator.userAgent.indexOf("Chrome") ? chrome.runtime : browser.extension).getURL("images/imgrt.png") + '" alt="Rotten Tomatoes"></a></div>');
    $(".plus-rating-link-container").append('<div class="plus-link"><a href="' + url.replace(/<[^>]*>?/g, "") + '" target="metacritic"><img src="' + (-1 !== navigator.userAgent.indexOf("Chrome") ? chrome.runtime : browser.extension).getURL("images/imgrt_sq.png") + '" alt="RottenTomatoes.com" title="www.rottentomatoes.com"></a></div>');
    url = "https://www.csfd.cz/hledat/?q=" + JSONdata.Title + "+" + JSONdata.Year.substr(0, 4);

    chrome.runtime.sendMessage(url, function (csfdFindRAW) {
      var imdbmovietitle = JSONdata.Title;
      var movietype = ".main-" + JSONdata.Type.substring(0, 5) + "s .article-content";
      csfdFindRAWdata = csfdFindRAW.data;

      if ($(csfdFindRAWdata).find(movietype).length) {
        $(csfdFindRAWdata).find(movietype).each(function (index, value) {

          // Helper to normalize titles (remove special chars/spaces)
          function normalize(str) {
            return str ? str.toLowerCase().replace(/[^a-z0-9]/g, "") : "";
          }

          var imdbmovietitlealt = JSONdata.Title.toLowerCase().startsWith("the ") ? JSONdata.Title.substring(4) + ", the" : JSONdata.Title;
          var movietitle = $(value).find(".film-title-name").text();
          var movietitleother = $(value).find(".search-name").text().slice(1, -1);
          var moviepath = $(value).find(".film-title-name").attr("href");

          var moviecreators = [];
          var imdbdirectors = JSONdata.Director.split(", ").map(n => n.toLowerCase());
          var imdbactors = JSONdata.Actors.split(", ").map(n => n.toLowerCase());

          $(value).find(".film-creators a").each(function (ind, val) {
            moviecreators.push($(val).text().toLowerCase());
          });
          const matchdirectors = imdbdirectors.filter(element => moviecreators.includes(element));
          const matchactors = imdbactors.filter(element => moviecreators.includes(element));

          const normImdb = normalize(imdbmovietitle);
          const normImdbAlt = normalize(imdbmovietitlealt);
          const normCsfd = normalize(movietitle);
          const normCsfdOther = normalize(movietitleother);

          if (normImdb == normCsfd || normImdb == normCsfdOther || normImdbAlt == normCsfd || normImdbAlt == normCsfdOther) {
            chrome.runtime.sendMessage("https://www.csfd.cz" + moviepath, function (csfdPageRAW) {
              var csfdPageRAWdata = csfdPageRAW.data;
              var badgeBg = "plus-badge-purple";
              var badgetitle = "Snímek je neověřený &#10;-Shoduje se název a rok výroby. &#10;- Neshodují se režisér nebo herci";
              var ratingBg = "plus-rating-none";
              var CsfdUrl = "https://www.csfd.cz" + moviepath;
              csfdPageRAWdata = $.trim($(csfdPageRAWdata).find(".film-info-content .film-rating-average").text());

              if (csfdPageRAWdata && "? %" !== csfdPageRAWdata) {
                ratingBg = "plus-rating-blue";
                if (parseInt(csfdPageRAWdata) >= 70) ratingBg = "plus-rating-red";
                if (parseInt(csfdPageRAWdata) <= 30) ratingBg = "plus-rating-black";
              }

              if (matchdirectors.length > 0 || matchactors.length > 0) {
                badgeBg = "plus-badge-green";
                badgetitle = "Snímek je ověřený &#10;- Shoduje se název a rok výroby &#10;- Shoduje se režisér nebo herci";
              }

              $(".plus-rating-container").append('<div title="Hodnocení na CSFD" class="plus-rating plus-rating-csfd ' + ratingBg + '"><a href="' + CsfdUrl.replace(/<[^>]*>?/g, "") + '" target="_blank">' + csfdPageRAWdata.replace(/<[^>]*>?/g, "") + "</a></div>");
              $(".plus-rating-container").append('<div title="CSFD" class="plus-rating-img plus-rating-csfd ' + ratingBg + '"><a href="' + CsfdUrl.replace(/<[^>]*>?/g, "") + '" target="_blank"><img src="' + (-1 !== navigator.userAgent.indexOf("Chrome") ? chrome.runtime : browser.extension).getURL("images/imgcsfd.png") + '" alt="CSFD"></a></div>');
              $(".plus-rating-link-container").append('<div class="plus-link"><a href="' + CsfdUrl.replace(/<[^>]*>?/g, "") + '" target="csfd"><img src="' + (-1 !== navigator.userAgent.indexOf("Chrome") ? chrome.runtime : browser.extension).getURL("images/imgcsfd_sq.png") + '" alt="CSFD.cz" title="www.csfd.cz"></a></div>');
              $(".plus-rating-img.plus-rating-csfd").append('<div class="' + badgeBg + '" title="' + badgetitle + '"></div>');
            });
          } else {
            $(".plus-rating-container").append('<div title="Hodnocení na CSFD" class="plus-rating plus-rating-csfd plus-rating-none">N/A</div>');
            $(".plus-rating-container").append('<div title="CSFD" class="plus-rating-img plus-rating-csfd plus-rating-none"><img src="' + (-1 !== navigator.userAgent.indexOf("Chrome") ? chrome.runtime : browser.extension).getURL("images/imgcsfd.png") + '" alt="CSFD"></div>');
            $(".plus-rating-img.plus-rating-csfd").append('<div class="plus-badge-black" title="Snímek nenalezen &#10;- Neshoduje se název nebo rok výroby"></div>');
          }

          if (matchdirectors.length > 0 || matchactors.length > 0) return false;
        });
      } else {
        $(".plus-rating-container").append('<div title="Hodnocení na CSFD" class="plus-rating plus-rating-csfd plus-rating-none">N/A</div>');
        $(".plus-rating-container").append('<div title="CSFD" class="plus-rating-img plus-rating-csfd plus-rating-none"><img src="' + (-1 !== navigator.userAgent.indexOf("Chrome") ? chrome.runtime : browser.extension).getURL("images/imgcsfd.png") + '" alt="CSFD"></div>');
        $(".plus-rating-img.plus-rating-csfd").append('<div class="plus-badge-black" title="Snímek nenalezen &#10;- Neshoduje se název nebo rok výroby"></div>');
      }
    });
  });
}
$(document).ready(function () {
  var search, title, CookieDate = new Date, imdb = (CookieDate.setFullYear(CookieDate.getFullYear() + 10),
    document.cookie = "adbwshown=" + CookieDate + ";expires=" + CookieDate.toUTCString() + ";SameSite=Lax",
    "https://www.titulky.com/" === location.href && $("#searchTitulky").focus(),
    -1 !== location.href.indexOf("Fulltext") && $("#searchTitulky").length && (search = $("#searchTitulky").val().toLowerCase()).length && ($(".soupis td:nth-child(1)").slice(1).filter(function () {
      return $(this).text().trim().toLowerCase().replace(new RegExp(/ s\d{2}e\d{2}.*/), "") == search;
    }).closest("tr").addClass("plus-topped"),
      $(".plus-topped:first").attr("id", "titulek").attr("name", "titulek"),
      window.location.hash = "titulek"),

    $("h1").length && $("a[target='imdb']").length && -1 !== location.href.indexOf("pozadavek-") && $("a[href$='Logoff=true']").length && (imdb = $("a[target='imdb']").attr("href").split("title/")[1].slice(0, -1)),
    $("h1").length && $("a[target='imdb']").length && -1 == location.href.indexOf("pozadavek-") && ((title = (CookieDate = $("h1").text().split(" ("))[0]).replace(new RegExp(" ", "g"), "+").replace("&", ""),
      CookieDate = CookieDate[1].substring(0, 4),
      imdb = $("a[target='imdb']").attr("href").split("title/")[1], displayRatings(imdb))
  );
});