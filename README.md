# Recent Colors for Google Doc

If you have also struggled with "I think I just used the 2nd blue from the bottom" and then realizing it's actually the 3rd one, this chrome extension is going to help you. By remembering the most recently used 10 colors on the Google Doc, you won't ever need to become a master of telling the difference between light green vs. lighter green. Let the pacman guide your way, see it in action.

https://user-images.githubusercontent.com/6601308/170847716-d43f39b8-6cca-4926-ae6e-a3d91d662bd0.mov

## How to use it?

**NOTE**: Extension currently submitted for review - will update with links once it is published.

Simply download the extension at the chrome extension store, and it'll be automatically enabled on every new Google Doc page that you open.

## FAQ

Q: Why are recent colors hover-only?

A: While I have tried finding the matching color cell and call `.click()` on it, that doesn't seem to work. And coming up with my own click mechanism would mean decoding the command that's send with every click and I would need to interpret the currently selected text location as well (which I don't think is something that this extension should do). Because this is just a weekend project I did for fun, I simply wanted to create something that's intuitive enough to work with, without going through all the complexities. But if you have a way to make it work, your contribution would be greatly apprecaited!
