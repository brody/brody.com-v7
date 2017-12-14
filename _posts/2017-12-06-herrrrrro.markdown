---
layout: post
title:  Welcome to Jekyll1!!
category: journal
tags:
- html
- another one
date:   2016-12-06 09:21:03
thumbnail: https://placeimg.com/490/403
caption: "Product Design"
type: "Personal Project"
intro: "This is a personal project I worked on"
---

You'll find this post in your `_posts` directory - edit this post and re-build (or run with the `-w` switch) to see your changes!
To add new posts, simply add a file in the `_posts` directory that follows the convention: YYYY-MM-DD-name-of-post.ext.

Jekyll also offers powerful support for code snippets:

{% highlight css %}
// variables
$highlighter: #F8EC54;

.bg-white-97 {
  background-color: hsla(0,0%,100%,.97);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}
{% endhighlight %}

Check out the [Jekyll docs][jekyll] for more info on how to get the most out of Jekyll. File all bugs/feature requests at [Jekyll's GitHub repo][jekyll-gh].

[jekyll-gh]: https://github.com/mojombo/jekyll
[jekyll]:    http://jekyllrb.com

<ul>
  {% for tags in page.tags %}
    <li>{{ tags }}</li>
  {% endfor %}
</ul>

A simple paragraph with a class attribute.
{:.yourClass}
