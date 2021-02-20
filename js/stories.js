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
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <p class="star">&#9733</p>
        <p data-user="${story.username}" class="trash">&#128465</p>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

//the favorite stories don't need the feature of being a new favorite or removed
function generateFavStoryMarkup(story) {
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
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
    $(`#${story.storyId} .trash`).on("click", removeStory);

    if (currentUser !== undefined) {

      $(`#${story.storyId} .star`).on("click", currentUser.favoriteStory);
      for (let i = 0; i < currentUser.favorites.length; i++) {

        if (story.storyId === currentUser.favorites[i].storyId) {

          $(`#${story.storyId} .star`).css('color', 'rgb(255, 215, 0)');
        }
      }
    }
  }
  $allStoriesList.show();
}

//populates the favorites page with stories the currentUser
//has in their favorites
function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");
  
  $favStoriesList.empty();

  for (let fav of currentUser.favorites) {
    const $story = generateFavStoryMarkup(fav);
    $favStoriesList.append($story);
  }
}

//given the user has filled the three inputs in the submit form
//this function will add a new story to the storyList 
async function getStoryFormData(evt) {
  evt.preventDefault();
  console.debug("getStoryFormData");
  await storyList.addStory(currentUser,
    {title: $("#story-title").val(),
    author: $("#story-author").val(),
    url: $("#story-url").val()});
}

//this removes a valid story from the api and DOM
async function removeStory(evt) {
  evt.preventDefault();
  console.debug("removeStory");
  if ($(this).data("user") === currentUser.username) {
    await axios({
      url: `${BASE_URL}/stories/${$(this).closest("li").attr("id")}`,
      method: "DELETE",
      data: {"token" : currentUser.loginToken}
    })
    $(this).closest("li").remove();
    alert("this story has been permanently deleted from the page")
  } else {
    $(this).closest("li").remove();
    alert("this story has only been temporarily deleted because you did not post the story")
  }
}

$("#story-submit").on("click", getStoryFormData);

$("#nav-favorites").on("click", putFavoritesOnPage);