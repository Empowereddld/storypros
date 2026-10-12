/**
 * Picture cues for multiple-choice answer options.
 *
 * Children with Developmental Language Disorder lean on visual support to hold
 * an answer choice in mind while they compare it with the others. Every option
 * therefore gets a picture cue next to its text (never instead of it).
 *
 * Cues are matched from the option's own words, so new story content picks up
 * artwork automatically. Story authors can always override per option with an
 * explicit `emoji` (or `image`) field in the story JSON.
 *
 * Matching is keyword-based and ordered: the most specific phrases come first,
 * so "first aid kit" wins over the bare word "kit".
 */

type Cue = [pattern: RegExp, emoji: string];

const CUES: Cue[] = [
  // ── Categories / word-class answers ──
  // Category options show a small GROUP of members (3 emojis), not one:
  // a single member doesn't portray the "this is a group" idea.
  [/\bfeelings?\b|\bemotions?\b|emotion word/, "😊😢😠"],
  [/\bfood word\b|\bfoods?\b/, "🍎🍌🧀"],
  [/\bperson word\b/, "🧑👧🧓"],
  [/\bplace word\b|\bplaces?\b/, "🏫🏖️🌳"],
  [/\bweather word\b/, "🌦️☀️🌧️"],
  [/\bcolors?\b/, "🔴🔵🟢"],
  [/\banimals?\b/, "🐶🐱🐰"],
  [/\bfurniture\b/, "🪑🛏️🛋️"],
  [/\bclothes\b|\bclothing\b|wear it/, "👕🧦🧢"],
  [/\bvehicles?\b/, "🚗🚌🚲"],
  [/\bfirst aid (item|kit)\b/, "🩹💊🌡️"],
  [/\bclassroom tool\b|\btool\b/, "🛠️🔨✂️"],
  [/\btoys?\b|activity or toy|\bactivity\b/, "🧸⚽🪁"],
  [/\bfruits?\b/, "🍓🍎🍇"],

  // ── Actions ──
  [/eat (it|them)|\beating\b|\beat\b/, "🍽️"],
  [/\bcook (it|dinner)\b|cooks food/, "🍳"],
  [/\bthrow it\b/, "🤾"],
  [/\bfly it\b|so it can fly/, "🪁"],
  [/brush teeth/, "🪥"],
  [/cover a cut/, "🩹"],
  [/write with it|writes words/, "✏️"],
  [/draw with it|paint with it/, "🖌️"],
  [/cuts paper/, "✂️"],
  [/moves? water|move water/, "🌊"],
  [/climb up|go in|show it to enter|shows? it to enter/, "🚪"],
  [/put pieces together|fit with other parts/, "🧩"],
  [/build it for fun|something you build/, "🧱"],
  [/plant it/, "🌱"],
  [/play (it|basketball there|sports there)/, "⛹️"],
  [/follow the steps|shows the steps|\bsteps( and order)?\b/, "📋"],
  [/sit down|sleep on it/, "🛋️"],
  [/fall asleep|fast asleep|sleeping|asleep|\bsleepy\b|snoring|yawning/, "😴"],
  [/pretend you understand/, "🤥"],
  [/gives power|power source/, "🔋"],
  [/tells time/, "🕒"],
  [/makes music|dancing and singing/, "🎵"],
  [/shine in the dark/, "🔆"],
  [/nothing (at all|changes at all)/, "🚫"],
  [/carry food/, "🍱"],

  // ── Feelings and reactions ──
  [/happy smile|big smile|smile really big|smiling/, "😄"],
  [/clapping|cheering/, "👏"],
  [/jumping with joy|\bexcited\b|very energetic|running around excitedly/, "🤩"],
  [/\bconfused\b/, "😕"],
  [/\bembarrassed\b/, "😳"],
  [/\bhungry\b|tummy growls|very full/, "🍽️"],
  [/very cold/, "🥶"],
  [/very relaxed|deep breath and relax|peacefully/, "😌"],

  // ── Places ──
  [/\bbathtub\b/, "🛁"],
  [/\bfreezer\b/, "🧊"],
  [/fish tank/, "🐠"],
  [/lunch ?box/, "🍱"],
  [/\blunchroom\b/, "🍽️"],
  [/\bclassroom\b|school|helps students learn|\blesson\b/, "🏫"],
  [/\bbedroom( drawer)?\b/, "🛏️"],
  [/\bgarage\b/, "🚗"],
  [/\bbeach\b|pile of sand/, "🏖️"],
  [/\bocean\b|part of the ocean|toward shore/, "🌊"],
  [/\bpark\b|grass and open space|lines and grass|open space|\bfield\b/, "🌳"],
  [/\bcarnival\b/, "🎡"],
  [/\bentrance\b|door or gate|gate or sign|object for entering/, "🚪"],
  [/soccer goal|\bhoop\b/, "🥅"],
  [/puzzle box/, "🧩"],

  // ── Objects, parts and features ──
  [/sticky strip|soft pad/, "🩹"],
  [/folded paper|paper triangle|flat sheet of paper|large flat white surface/, "📄"],
  [/round ball of paper|round ball/, "⚪"],
  [/long rope|\bstring\b/, "🪢"],
  [/\bwheels?( and pedals)?\b/, "🛞"],
  [/\bwings?\b/, "🪽"],
  [/\broots?\b/, "🌿"],
  [/\bleaf\b|tree branch/, "🍃"],
  [/\bteeth\b/, "🦷"],
  [/\btails?\b/, "🐾"],
  [/\blegs?\b|back and legs|flat top with legs/, "🦵"],
  [/\bbuttons?\b/, "🔘"],
  [/\bbarcode\b|words or numbers|information or directions|object with directions/, "🔠"],
  [/\bbackpack\b/, "🎒"],
  [/\bspoon\b/, "🥄"],
  [/\btables?\b|flat surface with edges|chair or bench/, "🪑"],
  [/big pillow/, "🛏️"],
  [/markers and eraser/, "🖊️"],
  [/cream and wipes/, "🧴"],
  [/small tube/, "🧪"],
  [/square box|towers? and walls|\btower\b|tall frame with steps/, "🧱"],
  [/pieces and edges|edges and shape|raised edges|small section or shape|part of something/, "🧩"],
  [/players and rules/, "🏅"],
  [/two ends|\btop\b/, "🔺"],
  [/moving bump of water/, "🌊"],

  // ── Time / when answers ──
  [/when it is dark|while sleeping/, "🌙"],
  [/when it is raining|thunderstorm/, "🌧️"],
  [/when you eat lunch|while eating lunch/, "🍱"],
  [/while running a race|running very fast/, "🏃"],
  [/when you are swimming/, "🏊"],

  // ── Feeling faces and body cues ──
  [/frown|biting lip|wringing hands|turn red and look down/, "😟"],
  [/crying|red face/, "😢"],
  [/sitting alone|looking down, quiet|give up and walk away/, "😔"],
  [/jumping up and down|screaming/, "🤩"],
  [/yell at the other kids/, "😠"],
  [/heart beats very fast/, "💓"],
  [/calm and peaceful/, "😌"],
  [/getting a hug|pet a puppy/, "🤗"],
  [/stub your toe/, "🤕"],
  [/take a nap/, "😴"],
  [/bubble bath/, "🛁"],
  [/watching your favorite show/, "📺"],
  [/birthday present/, "🎁"],
  [/score a goal|win a game/, "🏆"],
  [/play with friends|playing your favorite game/, "🎲"],

  // ── Objects (second pass) ──
  [/castle shape made of sand/, "🏖️"],
  [/many pieces with a picture/, "🧩"],
  [/missing part of the directions|page with words or pictures|instruction page/, "📄"],
  [/write or draw on it/, "✏️"],
  [/paper or digital pass/, "🎟️"],
  [/\bcar\b/, "🚗"],

  // ── Generic fallbacks (kept last) ──
  [/\ba feeling\b/, "😊😢😠"],
  [/\ba food\b/, "🍎🍌🧀"],
  [/\ban animal\b/, "🐶🐱🐰"],
  [/\ba place\b|place or furniture/, "🏫🏖️🌳"],
  [/\bobject\b/, "📦"],
];

/**
 * Best picture cue for an answer option, or null when nothing fits.
 * Full-sentence options (the silly-sentence questions) get no cue: a single
 * emoji there would mislabel the whole sentence.
 */
export function getOptionPictureCue(text: string, authoredEmoji?: string): string | null {
  if (authoredEmoji) return authoredEmoji;

  const normalized = text.trim().toLowerCase();
  if (!normalized) return null;
  if (normalized.split(/\s+/).length > 5) return null;

  for (const [pattern, emoji] of CUES) {
    if (pattern.test(normalized)) return emoji;
  }
  return null;
}
