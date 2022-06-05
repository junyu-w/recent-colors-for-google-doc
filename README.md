# Recent Colors for Google Doc

![icon128](https://user-images.githubusercontent.com/6601308/172075230-edf26f0c-36a3-441b-948f-fdd529967fd0.png)

If you have also struggled with "I think I just used the 2nd blue from the bottom" and then realizing it's actually the 3rd one, this chrome extension is going to help you. By remembering the most recently used 10 colors on the Google Doc, you won't ever need to become a master of telling the difference between light green vs. lighter green. Let the pacman guide your way, see it in action.

https://user-images.githubusercontent.com/6601308/170847716-d43f39b8-6cca-4926-ae6e-a3d91d662bd0.mov

## How to use it?

Simply download the [extension](https://chrome.google.com/webstore/detail/recent-colors-for-google/caigcmlhfgliglhadagoplhficigdonn) at the Chrome extension store, and it'll be automatically enabled on every new Google Doc page opened.

## FAQ

**Q: Why are recent colors hover-only?**

A: While I have tried finding the matching color cell and call `.click()` on it, that doesn't seem to work. And coming up with my own click mechanism would mean decoding the command that's send with every click and I would need to interpret the currently selected text location as well (which I don't think is something that this extension should do). Because this is just a weekend project I did for fun, I simply wanted to create something that's intuitive enough to work with, without going through all the complexities. But if you have a way to make it work, your contribution would be greatly apprecaited!

**Q: Does it collect any data from the Google Doc page?**

A: Nope, everything is completely on your local machine, there's no external packages used in this extension and no data collection scripts either.

**Q: Will it extend to more Google products, like Google Sheets or Slides?**

A: Maybe. Those two products do have "theme" that makes reusing colors easier, but if you think you really want this to be added there, submit an issue and if there's enough interest I'll work on it!
