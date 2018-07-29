---
layout: post
title:  Brody.com Nightmode
tags:
- Design
- UX
- JS & CSS
date:   2017-05-02 10:21:03
thumbnail: /images/170502/nightmode-thumb.jpg
feature-image: /images/170502/nightmode.jpg
category: journal
description: As a fun weekend project, I implemented a Nightmode that kicks in between 6:00pm & 8:00am.
---

As a fun weekend project, I implemented a _Nightmode_ that kicks in between 6:00pm & 8:00am.  

Want to check it out before 6pm? Add `class: "night"` to the body tag in the DOM.

```sass
iframe {
  width: 100%;
  max-width: none;
  @include breakpoint($sm) {
    display: block;
    padding: 0;
    float: none;
    max-width: 650px;
  }
}
```
```html
<p class="pr6-ns mt3">
  I’m a Product Designer focused on creating digial experiences that empower people and solve real-world problems.
</p>
<h3 class="section-header mt3 mb2">Currently</h3>
<p class="pr6-ns mt2">Designing how recruiters find the right candidates for the right job at <a href="#">JobAdder</a>.</p>
```

[Dribbble shot](https://dribbble.com/shots/3453321-Night-Mode-Brody-com)
