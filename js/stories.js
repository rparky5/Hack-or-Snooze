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
 *
 */
function putFavoriteStoriesOnPage() {
  $favStoriesList.empty();

  // loop through all of our favorite stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $favStoriesList.append($story);
  }

  $favStoriesList.show();
}


/** Gets data from user submitted form, calls .addStory and puts the new story on the page */
async function addNewStoryToStoryList(evt) {
  evt.preventDefault();

  const author = $("#create-author").val();
  const title = $("#create-title").val();
  const url = $("#create-url").val();

  const story = await storyList.addStory(currentUser, { title, author, url });
  const $story = generateStoryMarkup(story);

  $allStoriesList.prepend($story);
  $submitForm.hide();
  $submitForm[0].reset();
}

$('#post-submit-btn').on('click', addNewStoryToStoryList)

/**
 * TODO: doc string
 */
function favHandler(story) {
  if (!currentUser) {
    return '';
  }

  const idArr = currentUser.favorites.map(favStory => favStory.storyId);

  if (idArr.includes(story.storyId)) {
    return "bi bi-star-fill";
  } else {
    return "bi bi-star";
  }
}

/**
 * TODO: doc string
 */
async function starClickHandler() {
  let story;
  const clickedStoryId = $(this).parent()[0].id;

  for (let storyObj of storyList.stories) {
    if (clickedStoryId === storyObj.storyId) {
      story = storyObj;
    }
  }

  if (!story) {
    story = await Story.getStoryFromStoryId(clickedStoryId);
  }

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