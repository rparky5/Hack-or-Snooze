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
    - make sure only logged in users can fa

UI
- Goal: display stars next to storys in storylist
    - function to hide or show all icons
        - if not logged in, hide all icons
        - if logged in, show all icons
    - function to change star state (on load)
        - loop through stories
            - if story is in currentUser favorites[]
                - make the star a filled in star
            - else
                - make the star an empty star

    - function to change star state (when clicked)
        - eventListener for each <i>
            - if the story star is filled
                - replace the icon with an unfilled star
                - call unFavorite(story);
            - else
                - replace the icon with a filled star
                - call Favorite(story);

