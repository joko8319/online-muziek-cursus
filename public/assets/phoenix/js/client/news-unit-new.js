function appendHtml() {
  $('.post-shares').each(function () {
    var currentDiv = $(this);

    var commentCountEl = $(currentDiv).parent('.post-respect').find('.post-comments');
    var commentCount = $(currentDiv).parent('.post-respect').find('.comment-js-count').text();

    if (commentCount == '0') {
      $(commentCountEl).hide();
    }
  });
}

var paginationNumber = 0;
var paginationIsFetching = false;
var reachedEnd = false;

var amount = $('.news-units-holder').data('paginationamount');

// For pages list fetch number of pages from api
function fetchNumberOfPagesFromApi() {
  $.getJSON(
    window.phxsite.app_domain +
      '/v2/api/articles_pagination_pages?full_slug=' +
      location.pathname +
      '&amount=' +
      amount,
    function (data) {
      appendPagesSelectorToDom(data.pages);
    }
  );
}

//fetch posts from api and call the dom append function
function fetchPostsFromApi(page) {
  paginationIsFetching = true;
  paginationNumber = typeof page !== 'undefined' ? page : paginationNumber + 1; //increment pagination

  if (typeof amount === 'undefined') {
    amount = 8;
  }

  var posts = [];

  $.getJSON(
    window.phxsite.app_domain +
      '/v2/api/articles_pagination?full_slug=' +
      location.pathname +
      '&amount=' +
      amount +
      '&pagination_number=' +
      paginationNumber,
    function (data) {
      $.each(data.posts, function (key, val) {
        posts.push(val);
      });

      //posts = posts.slice(1);

      if (posts.length == 0) {
        reachedEnd = true;
      } else {
        appendPostsToDom(posts, typeof page !== 'undefined');
      }
    }
  );

  // Set class to active paginated class
  if (typeof page !== 'undefined') {
    $("[id^='page_']").each(function () {
      $(this).removeClass('active');
    });
    $('#page_' + page).addClass('active');
  }
}

//fetch auhtor posts from api and call the dom append function
function fetchAuthorPostsFromApi(authorId) {
  paginationIsFetching = true;
  paginationNumber = paginationNumber + 1; //increment pagination

  if (typeof amount === 'undefined') {
    amount = 8;
  }

  var posts = [];

  $.getJSON(
    window.phxsite.app_domain +
      '/v2/api/articles_pagination?full_slug=' +
      location.pathname +
      '&amount=' +
      amount +
      '&pagination_number=' +
      paginationNumber +
      '&author_id=' +
      authorId,
    function (data) {
      $.each(data.posts, function (key, val) {
        posts.push(val);
      });

      //posts = posts.slice(1);

      if (posts.length == 0) {
        reachedEnd = true;
      } else {
        console.log(posts);
        appendPostsToDom(posts);
      }
    }
  );
}

//append posts to the dom
function appendPostsToDom(posts, replace) {
  //get html block
  var posts_html_base_block = $('#postBlockPlaceholder').html();
  //posts_html_base_block = posts_html_base_block.replace(":renderPlaceHoldTag", '');

  console.log(posts_html_base_block);

  if (replace) {
    $('.blog_overview_element_wrapper .news-units-holder').html('');
  }

  //add each post
  $.each(posts, function (key, post) {
    var post_html_block = posts_html_base_block;
    post_html_block = post_html_block.replaceAll('<post-title></post-title>', post.title);
    post_html_block = post_html_block.replace(
      '<full-post-link>',
      '<a class="post-link-class" href="' + post.permalink + '">'
    );
    post_html_block = post_html_block.replace('<post-author-name></post-author-name>', post.author);

    post_html_block = post_html_block.replace('</full-post-link>', '</a>');
    post_html_block = post_html_block.replace(
      '<post-shares-amount></post-shares-amount>',
      post.shares_amount
    );
    post_html_block = post_html_block.replace(
      '<post-comments-amount></post-comments-amount>',
      post.comments_amount
    );
    post_html_block = post_html_block.replace(
      '<post-author-image-url></post-author-image-url>',
      post.author_image
    );

    if (post.is_sticky) {
      post_html_block = post_html_block.replace(
        '<post-pinned></post-pinned>',
        '<i class="pinned-post fas fa-thumbtack"></i>'
      );
    }

    post_html_block = post_html_block.replace(
      '<primaryblogcategory></primaryblogcategory>',
      '<a href="' + post.category_url + '">' + post.category + '</a>'
    );

    const srcsetIfAvailable = post.image_srcset ? `srcset="${post.image_srcset}"` : '';
    post_html_block = post_html_block.replace(
      '<post-image></post-image>',
      `<img src="${post.image}" ${srcsetIfAvailable}>`
    );

    //Make sure the content only has 80 chars max
    var minifiedContent = post.excerpt;
    minifiedContent = minifiedContent.replace(/\[.*\]/, '');
    minifiedContent = minifiedContent.replace(/<a.*>/, '');
    minifiedContent = minifiedContent.replace(/<\/.*a>/, '');
    minifiedContent = minifiedContent.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
    minifiedContent = minifiedContent.slice(0, 80);
    minifiedContent = minifiedContent + '...';

    post_html_block = post_html_block.replace(
      '<post-excerpt :max-length="80"></post-excerpt>',
      minifiedContent
    );

    if (post.legacy_date != false) {
      post_html_block = post_html_block.replace('<post-date></post-date>', post.legacy_date);
    }

    post_html_block = post_html_block.replace('<readtime></readtime>', post.readtime);

    //find post wrapper (only support 1 at a time on a page atm)
    $(post_html_block)
      .hide()
      .appendTo('.blog_overview_element_wrapper .news-units-holder')
      .fadeIn(800);
  });

  if (replace) {
    $(
      '<div id="postBlockPlaceholder" style="display: none;">' + posts_html_base_block + '</div>'
    ).appendTo('.blog_overview_element_wrapper .news-units-holder');
  }

  //Hehehe "poef"
  //$('body').phxSocialCountersTwo();
  appendHtml();

  paginationIsFetching = false;
}

function currentPageText(pageId, number_of_pages) {
  return 'Pagina ' + pageId + ' van ' + number_of_pages;
}

function prevNext(direction, number_of_pages) {
  let activePage = $('.pages_selector').find('.pages_selector__page.active');
  let pageId = activePage[0].id.replace('page_', '');
  let currentPage = $('.pages_selector__current');
  let authorId = '';

  if ($('.author-related-content').length !== 0) {
    authorId = $('.author-related-content').data('authorid');
  }
  currentPage.html(currentPageText(pageId, number_of_pages));
  if (direction === 'previous') {
    pageId = parseInt(pageId) - 1;
  }
  if (direction === 'next') {
    pageId = parseInt(pageId) + 1;
  }
  currentPage.html(currentPageText(pageId + 1, number_of_pages));

  if (pageId === 0) {
    $('.pages_selector__previous').addClass('not-active');
  } else {
    $('.pages_selector__previous').removeClass('not-active');
  }

  if (pageId === number_of_pages - 1) {
    $('.pages_selector__next').addClass('not-active');
  } else {
    $('.pages_selector__next').removeClass('not-active');
  }

  $("[id^='page_']").each(function () {
    $(this).removeClass('active');
  });
  $('#page_' + pageId).addClass('active');

  if (authorId !== '' && authorId !== 'undefined') {
    fetchAuthorPostsFromApi(authorId, pageId);
  } else {
    fetchPostsFromApi(pageId);
  }
}

function appendPagesSelectorToDom(number_of_pages) {
  let pages_selector = '<div class="pages_selector">';
  let authorId = '';
  if (number_of_pages === 0) {
    return;
  }

  if ($('.author-related-content').length !== 0) {
    authorId = $('.author-related-content').data('authorid');
  }
  pages_selector +=
    '<div class="pages_selector__current">' + currentPageText(1, number_of_pages) + '</div>';
  pages_selector += '<i class="pages_selector__previous fas fa-chevron-circle-left"></i>';
  for (let i = 0; i < number_of_pages; i++) {
    pages_selector +=
      '<span class="pages_selector__page" id="page_' +
      i +
      '" onClick="' +
      (authorId != ''
        ? 'fetchAuthorPostsFromApi(' + authorId + ', ' + i + ' )'
        : 'fetchPostsFromApi(' + i + ')') +
      '">' +
      (i + 1) +
      '</span>';
  }

  pages_selector += '<i class="pages_selector__next fas fa-chevron-circle-right"></i>';
  pages_selector += '</div>';

  $(pages_selector)
    .hide()
    .insertAfter('.blog_overview_element_wrapper .news-units-holder')
    .fadeIn(800);

  $('.pages_selector__previous').on('click', function () {
    prevNext('previous', number_of_pages);
  });

  $('.pages_selector__previous').addClass('not-active');

  $('.pages_selector__next').on('click', function () {
    prevNext('next', number_of_pages);
  });
  $('#page_0').addClass('active');
}

function infiniteScroll() {
  var winHeight = $(window).height();

  if ($('.author-related-content').length !== 0) {
    var authorId = $('.author-related-content').data('authorid');
  } else {
    var authorId = '';
  }

  $(window).scroll(function () {
    if (reachedEnd == false) {
      //prevent multiple calls in 1 scroll
      if (paginationIsFetching == false) {
        if (
          $(document).scrollTop() >=
          $('.news-units-holder').offset().top + $('.news-units-holder').height() - winHeight
        ) {
          if (authorId != '') {
            fetchAuthorPostsFromApi(authorId);
          } else {
            fetchPostsFromApi();
          }
        }
      }
    }
  });
}

(function ($) {
  //determine pagination method
  var paginationType = $('.blog_overview_element_wrapper').first().data('paginationtype');

  //set fallback
  if (paginationType == '') {
    paginationType = 'static';
  }

  function pages() {
    // Get number of pages available:
    fetchNumberOfPagesFromApi();
  }

  if (paginationType == 'infinite_scroll') {
    infiniteScroll();
  }

  if (paginationType == 'pages') {
    pages();
  }
})(jQuery);
