

6/27/2026

[[repo link]](https://github.com/kakolla/typing-sim/)


I've recently started the goal of picking up rust, so I wanted to solidify it by doing a super easy project.

I'm going to be creating a little typing game since I like typing.


Some things i researched: 
- since this is a game, I came across a library called macroquad that can be used to make a quick 2d gui
- this isn't going to be systems-y, just to try to get a hold of the language by thinking and writing all the code from scratch


thought process:
- we'll need a gui
- some sort of event listener for key presses
- a game loop for the typing test
- some texts



For the gui i'll just use the starter code on the [website](https://macroquad.rs/)

For the key presses i will use the input submodule
```rust
use macroquad::input::KeyCode;

    pub fn resolve_key(key: &KeyCode) -> &str {
        let s: &str = match key {
            KeyCode::A => "A",
            ...
            KeyCode::Z => "Z",
            KeyCode::Space => " ",
            _ => ""
            };

}
 
```

And then call this in main.rs 
```rust

if let Some(key) = input::get_last_key_pressed() { 
...
    let pressed: &str = resolve_key(&key);
...
}

```

```
O was pressed
I was pressed
D was pressed
F was pressed
```

Next we want the actual game loop, where we have an input buffer that's the length of the entire text, and we detect if the user has typed the right or wrong letter
based on the current position in the text.

every time they press a key, the function makes this check. First let's get the typing part done, then move to a tape scroll mechanism after.

I'll alter the function above, add a lifetime specifier for the correct key to be only within this function (so the borrow goes back), and check against the current letter.
If it's correct, we move the index forward

```rust

main.rs
        if let Some(key) = input::get_last_key_pressed() {
            let res = resolve_key(current_letter, &key, &mut curr_index).unwrap();

            println!(
                "{} was pressed, which is correct: {}, the correct is: {}",
                res.1, res.0, current_letter
            );
        }

input_utils.rs
// updated the keycodes to return lowercase instead actually

    pub fn resolve_key<'a>(
        correct_key: &'a str,
        key: &KeyCode,
        curr_index: &mut usize,
    ) -> Result<(bool, &'static str), String> { 
        ...
        
        if k == correct_key {
            *curr_index += 1;
            return Ok((true, k));
        } else {
            return Ok((false, k));
        }

    }


```

And the magic is here! 
If we alter this line in main.rs
```rust
draw_text(&text, width / 2.0, height / 2.0, 48.0, WHITE);
```

to this (so it chops off the part before the index we have correct, it goes away)
```rust
draw_text(&text[curr_index..], width / 2.0, height / 2.0, 48.0, WHITE);
```

![typing](/posts/images/typing.gif)

Some things that i learned are that we can only access with [] with usize so we must cast, and that we can dereference a ref to get the actual value and cast to another type.

When I was trying the character while indexing the text, I saw we could use .chars().nth(), but that runs in O(n), so then I was thinking of
grabbing the text as bytes with as_bytes()[curr_index] which would get us a char. 

```rust
// it looked like this
current_letter_byte = &text[curr_index as usize]; // text is the stream of bytes, aka &[u8]
// and the letter byte is &u8


current_letter = &(*current_letter_byte as char);
// so similar to C, we can dereference the ref to get the u8, cast to char (valid since they are teh same size), 
// then reference it with & in front since current_letter is a &char

```

But I ended up sticking to string slices to avoid having to cast the char to a &str (for comparison), which was easier since i could do 
current_letter = &text[curr_index..curr_index + 1];

I was also planning on shifting the text to the left like a tape, but chopping off the typed parts looks nice as well, so i'll leave it at that.

Now I'll work on include a WPM/CPS counter, and the actual begin/end game loop ( to bring in the next text).


--
Game loop is pretty trivial, and for the WPM, we can calculating using this formula i saw online (how monkeytype does it):
```rust
// WPM = (characters_typed / 5) * (60 / time_in_seconds)
like so

fn get_wpm(chars_typed: usize, time_elapsed: f32) -> i32 {
    return ((chars_typed as f32 / 5.0) * (60.0 / time_elapsed)) as i32;
}

```

It works but it updates as fast as the game loop runs, so it doesn't look nice. To fix this, I'll add in a worker thread to calculate the wpm update every second, and the main thread
will write it to the screen. I am used to the C style way mutexes, so I had to learn the idiomatic rust way which was a little weird; we have to 
declare the variable within the mutex itself by using the Arc (Atomically Reference Counted - smart pointers) submodule. 

I wanted to go with threads to learn how they work here in rust (would definitely be easier to just make an update every 1s in just the main thread).

So now we have to clone the mutex because the worker thread function will take ownership of it (but it will still point to the same thing)

```rust 
// in main
let chars = Arc::new(Mutex::new(0 as usize));
let chars_clone = Arc::clone(&chars);
let wpm_text = Arc::new(Mutex::new("".to_string()));
let wpm_text_clone = Arc::clone(&wpm_text);

let mut now = Instant::now();
// let mut time_elapsed = 0.0;
let time_elapsed = Arc::new(Mutex::new(0.0 as f32));
let time_elapsed_clone = Arc::clone(&time_elapsed);

...
/// worker thread function
fn update_wpm(
    chars: Arc<Mutex<usize>>,
    time_elapsed: Arc<Mutex<f32>>,
    wpm_text_clone: Arc<Mutex<String>>,
) {
    loop {
        thread::sleep(Duration::from_millis(1000));

        // lock before writing
        {
            let chars_typed = chars.lock().unwrap();
            let time_passed = time_elapsed.lock().unwrap();
            // let wpm_text = format!("{} WPM", get_wpm(*chars_typed, *time_passed));
            let mut wpm_text_val = wpm_text_clone.lock().unwrap();
            *wpm_text_val = format!("{} WPM", get_wpm(*chars_typed, *time_passed));
        }
    }
}

```


The last thing i wanna do is have the text be random top 200 english words like monkeytype, which is trivial as well:




![final](/posts/images/final.gif)
