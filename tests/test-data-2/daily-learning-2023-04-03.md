---
public: true
title: "Daily Learnings: Mon, Jan 22, 2024"
description: "Daily Learnings: Mon, Jan 22, 2024"
blogPost: false
postSlug: "daily-learning-2023-04-03"
contentType: learnings
created: 2023-04-03T21:34:31-06:00
last_modified: 2024-01-22T20:36:19-07:00
---

<< [[daily-learning-2024-01-21|Previous]] | [[daily-learning-2023-04-04|Next]] >>

# Daily Learnings: Mon, Jan 22, 2024

> 'As I am, so are they; as they are, so am I.' Comparing others with oneself, do not kill nor cause others to kill.
> — The Buddha

## Notes on Trailhead Maintenance

Notes from things learned while I was completing my trailhead maintenance for all of my [[salesforce|Salesforce]] credentials

- You can now enable Person Accounts in SFDC without contacting Support, as long as the following is true in your org
  - Account object has >= 1 record type
  - User profiles that have read permissions on Accounts also have read permission on Contacts
  - OWD sharing settings or Contact is Controlled by Parent, or both Account/Contact are Private
- [[event-driven-architecture|Event-Driven Architecture]] Updates
  - You can filter which events are delivered based on the Filter Expression that is part of the `PlatformEventChannelMember`
    - Works for [[change-data-capture|Change Data Capture]] events as well as [[platform-events|Platform Events]]
      - _I think this works for CometD and Pub/Sub APIs_
  - On [[cometd|CometD]] subscriptions only, you can also group platform events to push multiple types of events to a single stream / client subscription instead of 1 subscription per event
- [[apex|Apex]] Code Coverage Updates
  - For all 2GP and unlocked packages, you can run a report using the `sfdx` CLI that will show all Apex classes that are low on code coverage
- Updated [[salesforce-oauth-flows|Salesforce OAuth Flow]]: Client Credentials Flow
  - New OAuth flow for server-to-server communication that is a more secure alternative to the Username/Password flow
  - [Documentation](https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_client_credentials_flow.htm&type=5)
  - Does not support refresh tokens
  - A much easier-to-implement (also less secure) alternative to the [[salesforce-auth-jwt-bearer-flow|SFDC JWT Bearer Token Flow]]
