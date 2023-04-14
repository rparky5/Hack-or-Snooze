"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  return $(`
      <li id="${story.storyId}">
      <i class="${favHandler(story)}"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);

    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/**
 * appends and displays user's favorite stories in $favStoriesList
 */
function putFavoriteStoriesOnPage() {
  $favStoriesList.empty();

  //if user has no favorites yet, fill the list with a placeholder
  if (currentUser.favorites.length === 0) {
    const $noFavs = $('<p> No favorites added! </p>');
    $favStoriesList.append($noFavs);
    $favStoriesList.show();
    return;
  }

  // loop through all of our favorite stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $favStoriesList.append($story);
  }

  $favStoriesList.show();
}



/**
 * Gets data from user submitted form,
 * calls storyList.addStory and appends story to storyList;
 */
async function addNewStoryToStoryList() {
  const author = $("#create-author").val();
  const title = $("#create-title").val();
  const url = $("#create-url").val();

  const story = await storyList.addStory(currentUser, { title, author, url });

  return story;
}

/**
 * UI changes to DOM after submitting a new story
 */
function addNewStoryToPage(story) {
  const $story = generateStoryMarkup(story);

  $allStoriesList.prepend($story);

  $submitForm.hide();
  $submitForm[0].reset();
}

/**
 * handles click on submit button for new story
 */
async function handleSubmitNewStory(evt) {
  evt.preventDefault();

  const newStory = await addNewStoryToStoryList();

  addNewStoryToPage(newStory);
}

$('#post-submit-btn').on('click', handleSubmitNewStory);

/**
 * accepts a Story instance
 * returns the name of the class of an icon based on if the story is favorited
 */
function favHandler(story) {
  if (!currentUser) {
    return '';
  }

  return currentUser.isFavorite(story) ? "bi bi-star-fill" : "bi bi-star";
}

/**
 * handles all actions when clicking on a star icon in the DOM
 * i.e. favorite->unfavorite or unfavorite->favorite
 */
async function starClickHandler() {
  let story;
  const clickedStoryId = $(this).parent()[0].id;

  //find story with clickedStoryId in storyList
  for (let storyObj of storyList.stories) {
    if (clickedStoryId === storyObj.storyId) {
      story = storyObj;
    }
  }

  //if story with clickedStoryId is not in storyList then get it from the server
  if (!story) {
    story = await Story.getStoryFromStoryId(clickedStoryId);
  }

  //if story is favorited, then unfavorite. else, add to favorites
  if ($(this).hasClass("bi-star-fill")) {
    $(this).attr('class', "bi bi-star");
    currentUser.unFavorite(story);
  } else {
    $(this).attr('class', "bi bi-star-fill");
    currentUser.addFavorite(story);
  }
}

$allStoriesList.on('click', 'i', starClickHandler);
$favStoriesList.on('click', 'i', starClickHandler);