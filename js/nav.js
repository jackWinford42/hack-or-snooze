"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

// when the submit link the nav in clicked
// the page displays the story posting form
function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $storyForm.show();
}

$storyPost.on("click", navSubmitClick);

//clicking the favorites link in the nav updates the page to 
//display only the stories a user has in their favorites
function navFavoritesClick(evt) {
  console.debug("navFavoriteClick", evt);
  hidePageComponents();
  $favStoriesContainer.show();

  $favStoriesLoading.show()
  putFavoritesOnPage();
  $favStoriesLoading.hide()
}

$navFavorites.on("click", navFavoritesClick);
/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}