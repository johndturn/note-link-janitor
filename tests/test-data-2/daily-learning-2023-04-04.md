---
public: true
title: "Daily Learnings: Tue, Apr 04, 2023"
description: "Daily Learnings: Tue, Apr 04, 2023"
blogPost: false
postSlug: "daily-learning-2023-04-04"
contentType: learnings
created: 2023-04-04T10:12:00-06:00
last_modified: 2024-01-22T20:36:28-07:00
---

<< [[daily-learning-2023-04-03|Previous]] | [[daily-learning-2023-06-13|Next]] >>

# Daily Learnings: Tue, Apr 04, 2023

> It is the mark of an educated mind to be able to entertain a thought without accepting it.
> — <cite>Aristotle</cite>

## New Named/External Credentials

I finally figured out how to work with the new [[salesforce|Salesforce]] Named Credentials system for external [[authentication]] and [[authorization]] using [[oauth|OAuth2.0]] / [[openid-connect|OpenID Connect]]. Example configurations can be found in the [[solvd|SOLVD]] repo, but basically these are the overall steps:

1. Create a new Auth. Provider with the correct OpenID information
1. Create a new External Credential related to the Auth. Provider, selecting `Browser Flow` as the means
1. Create a new Permission Set that will grant access to the External Credential
   - This Permission Set should grant all permissions to the `User External Credential` object
1. Map the Permission Set to the External Credential on the External Credential's detail page
   - Select the appropriate Permission Set and select `Named Principle` as the scheme
1. In the row that shows up for the new mapping, click on the dropdown arrow and click "Authenticate"
   - If configured correctly, this should take you to the external system where you will authenticate
1. Authenticate to the external system appropriately
1. Create a new Named Credential related to the External Credential that you've created
1. Use the Named Credential in your code / callouts

## Other Related Topics

- [[development|Development]]
- [[technology|Technology]]
