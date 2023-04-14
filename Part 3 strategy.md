Marking stories as favorites
- Goal: handle API requests to favorite and unfavorite posts
- Strategy
    - Two methods in User class, both take Story instance
        1. User.favorite(Story)
            - send a request to the API
            - add Story.storyID to the user.favorites[]
        2. User.unfavorite(Story)
            - send a request to the API
            - remove Story.storyID from the user.favorites[]
    - Making an API request for favorites:
     - https://hack-or-snooze-v3.herokuapp.com/users/*username*/favorites/*storyId*
     - data: {
                "token": user.loginToken
            }
    - added star icons depending on favorites array
    - need to handle click on stars
    - make sure only logged in users can fav/unfav & see nav bar
