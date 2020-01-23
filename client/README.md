# team 53 - Christopher Marcok, Lance Oribello, David Choi
To initally run the app, please run `npm install` to install dependencies.
Then `npm start` to start the server.

http://localhost:3000/ should open in your browser.

DoleOut: A web application that allows groups of people to track shared expenses.

Admins are differentiated from users in that they have the ability to rename and delete groups, delete group members, and delete chats and expenses from a group's timeline. 
The following views differ in admin and user functionality:
1. Profile - Admins can edit profile details. Users cannot do this.
2. "GroupsPage" - Admins can edit Group names or delete groups. Users cannot
3. Group - Admins can delete messages/expenses. Users cannot.
The admin view can be reached by adding `/admin` to the end of the URL for these views. Without `/admin`, the view will be for the default "user" user. You can see this in the routing in App.js.

These admin privileges are marked in bold throughout the document.

Note: it is assumed that no user is logged in on the home page, the registration page, or the login page. Consequently, the Register and Login tabs in the site header are only visible on these pages.

On other pages it is assumed that you are logged in as "user" or "admin", and the right part of the header is changed to only hold the profile tab, which is a link to your profile page (which currently is hard-coded to link to "user" or "admin", as we do not have a way to determine whether another user is logged in without server calls). 

_____________________

# WALKTHROUGH - ADMIN

### `/login`
From the home page, click login in the header. Enter the credentials:
* Username: admin, Password: admin

You will be taken to the groups page where you can view different groups. Note that this is the groups page view from the admin's perspective, not the user's.

### `/groups/admin`
Click the edit button on the right side of the group component to edit the group's name. Click the checkmark box (again on the right side) to confirm your edits. You can delete the group by clicking on the trash icon on the right side. 

Admins can create new groups just like a user. Scroll to the bottom of the groups page and click the large green button.
1. Enter a group title.
2. Enter usernames (one per row). Click the "New Row" button to add a new row.
3. Here are some usernames to choose: "bob", "joe", "sam". More can be found in "/src/data/dummy_user_list.json". Invalid/blank members will be ignored.
4. Select a color using the color picker, which will become the group's color in the groups page. Otherwise the default grey is used.
5. Select an icon.
6. Click Create Group.
The group you just made only exists in this view, so clicking on it will not redirect you to a real group (it will 404 since the group data was not written to anything). During phase 2, clicking "Create Group" should update the groups table in the database with the new group, and then you should be able to view it after creation.

From here, click on the "bad boys" group at the top. If you deleted it, refresh the page and then click on it.

### `/g/:group_number/admin`
The left column displays the users in the group. The Right column displays the group's current expenses, and a list of other groups you can navigate to. The middle column is a chat that displays messages and expenses.

1. Try deleting a user from the group by clicking the trash icon next to the user's username in the left column.
2. Scroll to the bottom of the left column. Click the large green plus button. Try adding the user "admin". This will add the user admin to the group. **NOTE**: You cannot add a user to the group that you have previously kicked. Again, this is because no data is written when "deleting" a user. It would be possible to add kicked users if we updated a table in the database when kicking/adding, but for now it merely checks to see if the user is present in the group JSON file.
3. Try adding a user that already exists. For example, add "jen" or "admin" a second time. Neither should work.
4. Try typing a message in the middle column chat box. Click enter or the send button to send the message.
5. Click any of the profile pictures in the middle column, or on the left column. It will redirect you to that user's profile. Return to the `/g/0/admin` page when you are done. 
6. Click on any of the expenses in the "Current Expenses" section on the right column. The expense in the chat will scroll into view. If your screen is too large and shows the entire chat, try making your window small so you only see one expense in the window at a time to try this.
7. Click any of the groups on the right to be redirected to that group. Click back when you are done to return to `/g/0/admin`.
8. Click the "New Expense" button in the top right corner of the middle column to create a new expense. Add an expense title. Add expense content (just add some random message about the expense). Add a cost to the expense. When focus of the cost input is left, it should automatically format itself to two decimal places. Add members to the expense. Here are some members to try: "billy", "joe", "sam", "bob". Click the "New Row" button to create a new row. Invalid/blank members will not be added .(they are ignored, and wont prevent you from making the expense). Click the new expense button to make an expense. 
9. You cannot pay the expense you just made (since your equal share of the expense's total cost is automatically deducted upon creating the expense). Instead, scroll to the "Toilet Paper" expense made by george and try paying that. You can view it by clicking the corresponding expense in the rightmost column under "current expenses". Paying $2.50 or more will cause the expense to be closed (since it has been fully paid off). **NOTE**: the cost of an expense is assumed to be divided evenly among all the expense members.
10. Try deleting a message (either a chat message or an expense) from the group chat. You can do this by clicking the trash icon on the right side of any message.

### `/u/:user_number/admin`
Click the right-most button on the site header labelled "Admin", which brings you to the profile page of "admin".
Click the edit button at the top right of the page to edit the information displayed.
Confirm and save any changes you make by clicking the save button, once again at the top right of the page, having replaced the edit button.
Note that any changes are reset upon reload without server calls updating a database.

Admins have the ability to edit the profile pages of any other user in the same way, through the edit button at the top right of any other user's profile page. You can try this by visiting another user's profile. Try this on the "user" page: `/u/1/admin`
The profile pages of other users can be accessed by clicking them in the member list column of a group, or by visiting the corresponding URL using this template: `/u/:user_number/admin`.

_____________________

# WALKTHROUGH - USER

### `/login`
From the home page, click login in the header. Enter the credentials:
* Username: user, Password: user

You will be taken to the groups page where you can view different groups. Note that this is the groups page view from the user perspective, not the admin's.

### `/groups`
Users can create groups. Scroll to the bottom of the groups page and click the large green button.
1. Enter a group title.
2. Enter usernames (one per row). Click the "New Row" button to add a new row.
3. Here are some usernames to choose: "bob", "joe", "sam". More can be found in "/src/data/dummy_user_list.json". Invalid/blank members will be ignored.
4. Select a color using the color picker, which will become the group's color in the groups page. Otherwise the default grey is used.
5. Select an icon.
6. Click Create Group.
The group you just made only exists in this view, so clicking on it will not redirect you to a real group (it will 404 since the group data was not written to anything). During phase 2, clicking "Create Group" should update the groups table in the database with the new group, and then you should be able to view it after creation.

**NOTE:** Currently, users can see all groups even without holding membership in them as permissions are not yet implemented and any group can be accessed via url. In Phase 2, we intend to restrict this so that users may not see or navigate to groups that they are not a member of.

From here, click on the "bad boys" group at the top.

### `/g/:group_number`
The left column displays the users in the group. The Right column displays the group's current expenses, and a list of other groups you can navigate to. The middle column is a chat that displays messages and expenses.

1. Scroll to the bottom of the left column. Click the large green plus button. Try adding the user "admin". This will add the user admin to the group.
2. Try adding a user that already exists. For example, add "jen" or "admin" a second time. Neither should work.
3. Try typing a message in the middle column chat box. Click enter or the send button to send the message.
4. Click any of the profile pictures in the middle column, or on the left column. It will redirect you to that user's profile. Return to the `/g/0` page when you are done. 
5. Click on any of the expenses in the "Current Expenses" section on the right column. The expense in the chat will scroll into view. If your screen is too large and shows the entire chat, try making your window small so you only see one expense in the window at a time to try this.
6. Click any of the groups on the right to be redirected to that group. Click back when you are done to return to `/g/0`.
7. Click the "New Expense" button in the top right corner of the middle column to create a new expense. Add an expense title. Add expense content (just add some random message about the expense). Add a cost to the expense. When focus of the cost input is left, it should automatically format itself to two decimal places. Add members to the expense. Here are some members to try: "billy", "joe", "sam", "bob". Click the "New Row" button to create a new row. Invalid/blank members will not be added (they are ignored, and wont prevent you from making the expense). Click the new expense button to make an expense. 
8. You cannot pay the expense you just made (since your equal share of the expense's total cost is automatically deducted upon creating the expense). Instead, scroll to the "Toilet Paper" expense made by george and try paying that. You can view it by clicking the corresponding expense in the rightmost column under "current expenses". Paying $2.50 or more will cause the expense to be closed (since it has been fully paid off). **NOTE**: the cost of an expense is assumed to be divided evenly among all the expense members.

### `/u/:user_number/`
Click the right-most button on the site header labelled "User", which brings you to the profile page of "user".
In phase 2, we intend for the user to be able to edit his or her own profile page in the same way an admin can, using an edit button at the top-right.
However, without server functionality at the moment, we cannot determine which user specifically is logged in to implement this.

_____________________

# PAGE BY PAGE SPECIFICATIONS

### Registration 

The Register tab takes you to a form where you can create a new user.
It does not allow you to create a user if the given username already exists or is empty, your given password has less than seven characters, or your password confirmation does not match.

If all the given fields are valid, the register button takes you to the profile page of "user", which is a temporary measure.
In the future, we intend a successful registration to take you to your own new profile page.
At the moment, registration does not actually have any back-end functionality without server calls.
_____________________

### Login

The Login tab takes you to a form where you can login to an existing user's account.
The following credentials are accepted currently:
    Username: user, Password: user
    Username: admin, Password: admin

Upon successful login, you are taken to the groups page, which differs in functionality depending on whether you log in as an admin or not. 
_____________________

### Profile 

We intend for this page to  be accessible using the "Profile" button in the site header, but that is currently hard-coded to link to the profile page of "user" or "admin" depending on which one logged in.

This page is otherwise accessible by clicking a user within a group (which does bring you to an individual's unique profile page), or upon registration (which is hard-coded to link to the profile page of "user" or "admin", as mentioned previously).

This page displays various user information, including username, full name, description, preferred payment method, and email.
For adminns, on the top right of the page is an edit button, which allows an admin to edit any of these fields.
Without server calls, any changed information is reset to default upon reloading the page.
_____________________

### Groups Page

This is accessible through the Groups button in the website header.
It currently contains various dummy groups, each with a name, icon, member list, and color.

**Admins are able to edit a group's name, or delete the group entirely using buttons on the right hand side of each group** (without server calls, any changed information or deleted groups are reset upon reloading the page). Users are unable to see these options presented.

At the bottom of the page, clicking on the green plus sign will pop up a form to create a new group.
Clicking on any of the already-created groups brings you to its individual group page, which are all currently hard-coded.
Without server calls, clicking on any newly created groups currently brings you to our 404 page.

The creation of a new group entails picking its title, group members, color, and icon.
Upon creating the group, the group is added to the Groups Page.
Without server calls, any newly created groups are erased upon reloading the page.
_____________________

### Group

Each individual group page is accessible through clicking one of the groups in the Groups tab.
Each group page consists of three columns:
1. The group members column
    Here is a list of all the members of a group.
    Clicking a member brings you to that member's individual (hard-coded) profile page.
    At the bottom of the list is a green plus, which allows you to add new members to the group by inputting their username.
    Note that adding members only adds the element to the page without any back-end functionality.
    Newly added members cannot be added to new expenses until server functionality is implemented in Phase 2.
    Only existing users (in our hard-coded master user list) can be added to groups.
    **Admins are able to remove members of the group.** Users are unable to see the remove buttons.
    Note that removing members only removes the element from the page without any back-end functionality.
2. The group messages timeline
    Here you can see a chronological list of sent messages to the group.
    A message can either be a text chat or a created expense, with each message having the user who sent the message and the time it was sent.
    At the top corner of the timeline is a button that allows you to create new expenses.
    Expenses are more thoroughly covered later on.
    **Admins are able to delete chats and expenses entirely.** Users are unable to see the deletion buttons.
    Without server calls, the page resets to our default hard-coded data on reload.
3. The current expenses and other groups column
    Here short blocks of information about each of the group's expenses are displayed, namely the creator of the expense and the expense's remaining debt.
    Below this are links to the other groups of the site.

_____________________

### Expenses

Through the New Expense button in the group timeline, a form will pop up to create a new expense.
You must input the expense's title, content (a description of the expense or whatever text information you wish to include), the total cost of the expense, and the members of the expense.
Members can only be added if they are within the group that the expense is created in.

The creator of the expense is automatically added as a member of the expense, and his or her share of the expense's total cost is deducted from the remaining cost.
Currently the cost of an expense is assumed to be divided evenly among all the expense members.

Upon creating the expense, the expense is displayed on the group timeline, showing its title, content, total cost, remaining cost, and how much the user has left to pay if applicable.

Below this information are the profile pictures of the members of the expense.
If a picture is greyed-out, that indicates that that member has paid their portion of the expense.
(Note, the creator of the expense has his or her picture greyed out automatically as their portion is assumed to already have been paid for upon creation of the expense)

Beside the member pictures is a pay button, which is clickable if the current user is a member of that expense and has not already paid their full share.
Upon clicking this pay button, the user is prompted how much he or she would like to pay. A user is not able to pay less than $0.01 or more than their even split of the expense's cost.
Upon inputting a valid amount to pay, that amount is deducted from the expense's remaining total, and the user's picture may be greyed out (depending if he or she paid the totality of their portion). 
Once the expense has been fully paid, the entire expense message in the timeline is greyed out and removed from the expense sidebar.

As before, any changes to expenses are reset upon reloading the page without server calls.

