import $ from 'jquery'

const apiUrl = "http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=parseQuote";
const tweetUrl = "https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=\"__TEXT__\" __AUTHOR__";
const colors = ['#3f51b5', '#880e4f', '#1a237e', '#0d47a1', '#01579b', '#33691e']
const fetchQuote = () => {
    $.ajax(apiUrl, { dataType: 'jsonp' })
}

window.parseQuote = (data) => {
    const url = tweetUrl.replace("__TEXT__", encodeURIComponent(data.quoteText)).replace("__AUTHOR__", data.quoteAuthor);
    $('#quote-text').html(data.quoteText)
    $('#quote-author').html(data.quoteAuthor ? data.quoteAuthor : 'Unknown')
    $('#tweet-quote').prop('href', url);
    
    $('body').css({backgroundColor: colors[ Math.floor(Math.random() * 6) ]})
}

(() => {

    fetchQuote()
    
    $('#new-quote').on('click', (e) => {
        e.preventDefault()
        fetchQuote()
    })
})()

