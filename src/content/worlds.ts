import type { SceneCard, WorldId } from "./types";

export type WorldDef = {
  id: WorldId;
  name: string;
  tagline: string;
  bible: string;
  scenes: SceneCard[];
};

const lookoutScenes: SceneCard[] = [
  {
    id: "lookout.stove",
    title: "The last coal",
    kind: "place",
    text: "The stove does not hurry. It keeps a single coal in the iron belly as if the coal were a thought that had not finished forming. The cabin around it is already decided: the chairs where they were left, the window that prefers the west, the kettle with its small patience. Ash settles in a way that suggests even numbers. A hairline of heat lifts from the grate and then thinks better of rising. The last coal is not a drama. It is a consideration. The stove considers whether the coal is still useful as coal, or whether it has become a kind of memory of fire, which is a different occupation. The damper is not quite closed. Air arrives in the smallest possible amount, enough to keep the orange from going grey. Outside, the slope does not comment. Inside, the iron ticks once, then waits to see if the tick required an answer. It did not. The coal holds. A seam of warmth travels the length of the stove’s back and rests in the stone. The cabin accepts this as weather. The stove, having considered, keeps the coal.",
  },
  {
    id: "lookout.quilt",
    title: "The knitted archive",
    kind: "body",
    text: "The quilt is heavier than it looks. Someone knitted objects into it that do not belong to any ordinary inventory: a small key, a moth, a window seen from inside, a cup with no handle. The stitches are even. The colors have gone the colour of woodsmoke. It is possible the quilt was dreamed and then made, or made and then dreamed until the two could not be told apart. The cabin does not adjudicate. The quilt lies over the chair as if the chair had asked for a second skin. A loose thread follows the grain of the armrest and then stops, having found nothing that needed mending. If a hand were to rest here it would find the moth first, then the key. No hand does. The pattern keeps its own company. Somewhere in the knitting there is a slope, and on the slope a barrel, but the barrel is only a circle of darker wool. The quilt does not explain itself. It is the sort of object that prefers to be sat with rather than read. The cabin, which has always been a refuge and never a museum, lets the quilt remain an archive of the unurgent.",
  },
  {
    id: "lookout.rain",
    title: "Rain on the west window",
    kind: "body",
    text: "Rain uses only the west window. The other glass stays dry enough to hold a faint indoor weather of its own. On the west pane the drops arrive as if they had been assigned this glass in particular. They find old paths and use them. The wood around the frame has learned the habit and darkened accordingly. There is no storm in it. The rain is a local decision. It ticks, then forgets to tick, then remembers. The cabin does not turn to look. The stove keeps its coal. The quilt keeps its moth. The west window keeps the rain as a correspondence it does not need to answer. Sometimes a drop pauses at a knot in the wood, as if the knot were a station. Then it continues. The slope beyond is a rumour of darker green. Nothing out there asks to come in. The rain is not weather that wants a fire; it is weather that wants a window, and it has one. The frame will swell a little by morning and then remember its original size, the way the cabin remembers most things: without making a report.",
  },
  {
    id: "lookout.barrel",
    title: "The apricot barrel",
    kind: "body",
    text: "On the slope, below the porch, a barrel still lies where it tumbled. The stamp on its side once said apricot, and the word is still almost there, the way a name is almost there on a door that has been painted over. The staves have opened enough to hold a small weather of their own. Rain finds the inside and leaves it. Moss has taken the lower rim with the patience of something that does not harvest. No one has rolled the barrel back. The cabin has not asked. Hikers who use this place as a refuge notice the barrel on the first stay and then, on later stays, notice that they have stopped noticing it, which is a kind of belonging. The barrel is not a wreck. It is a settled object. Inside, if one were to look, there would be a smell that is no longer fruit and not yet earth. The slope holds it without effort. From the window the barrel is a dark oval that does not move. The cabin finds this agreeable. Some things finish falling and then become landscape. The apricot barrel has done that, and continues to do it, quietly, on the same few yards of ground.",
  },
  {
    id: "lookout.kettle",
    title: "The kettle’s patience",
    kind: "body",
    text: "The kettle learned the cabin’s patience by sitting on the stove through many small fires. It no longer expects a full rolling boil. It expects a murmur, a seam of steam, a lid that lifts and settles as if clearing its throat. The enamel is chipped at the spout in a way that has become a feature. Water in it is never in a hurry to be tea. The kettle understands that the cabin is a refuge, and refuges do not perform. When heat arrives, the kettle receives it along the base and distributes it without commentary. When heat leaves, the kettle keeps a little, the way a pocket keeps a stone. There is a faint mineral taste that belongs to the pipes and to the mountain and to no particular person. The handle is cool. The whistle, if it still works, has not been asked in a long while. The kettle prefers not to be dramatic. It is enough to be warm and ready and not quite singing. The stove, which has its coal to consider, treats the kettle as a neighbor rather than a task. They share the iron. They do not discuss the slope.",
  },
  {
    id: "lookout.boots",
    title: "Boots by the door",
    kind: "body",
    text: "The boots by the door will not be needed until the weather changes, and the weather is not changing. They stand with their laces tucked, not in a military way, only in the way of things that have been set down by someone who intended to leave and then stayed. Mud on the soles has dried into a map of the last path, which was not far. The cabin does not mind boots that remain. A refuge is partly a place where walking can be postponed without being cancelled. The leather has the smell of oil and pine. One tongue sits higher than the other. Nothing will be done about that. Outside, the porch boards are wet enough to shine if there were more light. There is not more light. The boots wait without the posture of waiting. They are simply the boots that belong to this floor, for now. When the weather changes they will be filled again with feet and purpose. Until then they keep the shape of walking as a possibility stored beside the door, like firewood, like the extra blanket, like the knowledge of the slope.",
  },
  {
    id: "lookout.glass",
    title: "The lookout glass",
    kind: "body",
    text: "The lookout glass is not for naming. It is a square of seeing that has learned not to inventory the world. Trees remain trees. Fog remains fog. The habit here is to look until the looking becomes a kind of rest, and then to look a little longer without collecting. The glass has a warp in the lower corner that makes the slope lean, which the cabin has decided is accurate enough. Dust on the sill is arranged by drafts rather than by hands. Sometimes a bird crosses and is not counted. The glass does not keep a ledger. Hikers who stay the night often stand here first, as if the window were a duty, and then discover that the duty is to stop naming. The mountain does not require identification. The cabin, which is a refuge and not a station, prefers this. The lookout is a name that overstates the job. What happens here is closer to keeping company with a view that does not need an audience. The glass holds the dark. The dark holds whatever it holds. Nothing is reported.",
  },
  {
    id: "lookout.wood",
    title: "Even numbers of wood",
    kind: "body",
    text: "The firewood is stacked by someone who liked even numbers. Two, four, six, a neat finish at the end of the row, a small apology of bark where a split was not clean. The stack sits under the eave as if the eave had been measured for it. Dry enough. Not ceremonial. The person who stacked it is not here and does not need to be; the evenness remains as a kind of handwriting. The cabin respects this without becoming precious about it. A log will be taken from the end, and then another, and the evenness will be restored or it will not, and either way the stove will have what it needs. For now the row is complete. Resin smells faintly from a cut that is still pale. A beetle once lived in one of the rounds and left a tunnel that looks like a signature. The wood does not mind. It is between forest and fire, which is a respectable interval. The stack leans a finger’s width toward the wall, a lean so slight it might be the wall leaning back. The cabin, which likes things that have been considered, keeps the even numbers as they are.",
  },
  {
    id: "lookout.moth",
    title: "The moth at the lamp",
    kind: "body",
    text: "A moth works the lamp and then gives up. It is not a tragedy. The lamp is a low thing, more amber than white, more suggestion than declaration. The moth tests the glass, finds no nectar, finds no night-flower, finds only a round of heat that resembles a moon if one is a moth and not particular. After a while the moth rests on the shade as if the shade were a leaf. The cabin does not brush it away. There is room. The lamp continues. The moth’s wings show a map that will not be read. Dust from them stays on the shade in a print so faint it might already have been there. Giving up, in this case, is a form of settling. The moth may leave when the lamp is cooler. It may stay. The cabin has hosted both kinds of decision. Outside, other moths have the actual night, which is larger and less confusing. This one has chosen the indoor version. The stove ticks. The west window ticks. The moth, having worked the problem of the lamp, declines to work it further.",
  },
  {
    id: "lookout.floor",
    title: "Floorboards of a heavier winter",
    kind: "body",
    text: "The floorboards remember a heavier winter. They say so in the way they sit: a slight hollow near the stove where snow-boots once stood longer, a tightness near the door where cold used to arrive as a person. The wood is not complaining. Memory in floorboards is just a change in how they meet the joists. A step here sounds older than a step there. The cabin has not refinished anything. Refinishing would be a kind of forgetting, and the refuge is not in the business of forgetting winters, only of outlasting them. Between the boards, in the thin dark, there is a smell of pine tar and of wool that dried too close to heat. Nothing is wrong. The boards will take another winter when it comes, and another after that. For now they hold the quieter season. A nail head catches the lamp and looks like a small coin no one will spend. The quilt’s fringe touches the floor and is not corrected. The boards, which have carried wet and dry and the particular weight of people sleeping in their clothes, continue their work without asking what the work is called.",
  },
  {
    id: "lookout.porch",
    title: "The porch rail and the fog",
    kind: "body",
    text: "The porch rail holds fog the way some rails hold coats: as if the fog had leaned there on purpose. Beads of it gather on the grain and then decide whether to become water. Most of them remain fog a little longer, which is a courtesy. The porch itself is a narrow thought attached to the cabin, not quite inside, not quite slope. Boards give a little. The rail is smoother where hands have been, though no hands are on it now. Fog occupies the space with the confidence of a regular. It does not press against the door. It does not need to come in. It is enough to be held, briefly, by wood that has learned its weight. From inside, the rail is a darker line and then not a line. The cabin knows the fog is a debt the mountain pays to the air, and the rail is only a place where the debt is visible. No one is collecting. The fog will lift or it will not. The rail will be wet either way, and then less wet, and will not make a speech about it.",
  },
  {
    id: "lookout.close",
    title: "The cabin keeps watch",
    kind: "close",
    text: "The cabin agrees to keep watch without reporting anything. This is the whole of its arrangement with the night. The stove has kept the coal. The west window has kept the rain. The barrel has kept the slope. Nothing needs to be told to anyone. A refuge is not a station and not a story with an ending. It is a set of objects that have decided to remain useful in a quiet way. The lookout glass continues not to name what it sees. The boots continue not to be needed. The quilt continues to be heavier than it looks. If a hiker is sleeping here, the cabin will not inventory their breathing. If no one is sleeping here, the cabin will not inventory the absence. Watch, in this place, means remaining. The iron ticks. The fog holds the rail. The last coal is still a coal. The cabin, having agreed, does not file a report. It simply goes on being the place on the slope where weather can be waited out, and where waiting is not a test.",
  },
];

const archipelagoScenes: SceneCard[] = [
  {
    id: "archipelago.fog",
    title: "Fog with furniture",
    kind: "place",
    text: "The fog is so ordinary it has furniture. Chairs of it gather in the lane and then are not chairs. A table of it stands between houses and is walked through without apology. The village has lived in mist long enough that emptiness would be the surprise. Children here, if one can imagine children without summoning them, would learn weather as a kind of indoor. Lanterns do not fight the fog. They furnish it, the way a lamp furnishes a room. Wet cobbles hold coins of light and then spend them slowly. Nets, roofs, pilings: all of them have fog-shaped counterparts a few feet off, slightly wrong, slightly kind. No one rushes. Rushing is a mainland habit and the mainland is a rumour with a timetable. Here the fog sits down. It has always sat down. The village built around that sitting. A cup left on a sill fills with beads and is considered full enough. The fog does not mean isolation. It means the air has chosen to be neighborly and a little indistinct, which the village has decided is a culture, not a problem.",
  },
  {
    id: "archipelago.horn",
    title: "A ferry horn, possibly memory",
    kind: "horn",
    text: "A ferry horn arrives from so far it might be memory. The note is low and uninsistent, the sort of sound that has traveled over water until most of its edges have been set down along the way. No one goes to the quay to look. The quay will still be there. The horn might belong to a boat that still runs the short route, or to a boat that ran it so often the air kept a copy. In this place both explanations are considered polite. Windows do not rattle. Dogs, if there are dogs, do not comment. The village has a custom of letting distant sounds finish themselves. The horn does that. It leaves a shape in the fog that is almost a corridor and then is fog again. Someone oiling a hinge pauses, not out of alarm, only out of courtesy, as one pauses for a neighbor on a narrow path. Then the hinge continues. The horn does not repeat immediately. It may not repeat at all. The archipelago is not a destination tonight, and the ferry, real or remembered, seems to understand that.",
  },
  {
    id: "archipelago.nets",
    title: "Nets under a roof of fog",
    kind: "body",
    text: "Nets dry under a roof that is also fog. The twine holds beads. The beads hold a faint fish-silver that is no longer fish. Drying, here, is a slow negotiation with air that does not wish to be dry. The nets accept this. They have always accepted this. They hang in even loops from pegs worn smooth by the same hands or by different hands doing the same work. No one is mending them at the moment. Mending will happen when the fog thins enough to see the knots, or it will happen by touch, which is older. The roof above is timber until it isn’t. Fog continues the eaves outward, a second roof that cannot keep rain out and does not claim to. A drip finds a rope and follows it down like a sentence with too many commas. The village likes this kind of grammar. Work is not displayed. Work is left where it can finish becoming itself. The nets will be wet again. They will be dry enough. The distinction is not a crisis.",
  },
  {
    id: "archipelago.cup",
    title: "A cup left for weather",
    kind: "body",
    text: "There is a custom of leaving a cup for weather. Not as an offering with a speech. As a practical kindness, the way one leaves a chair. The cup sits on a sill facing the lane. Fog fills it. Rain, when rain is in the mood, adds a more definite water. In the heat that sometimes finds even this place, the cup holds a little dust and a drowned midge and is still doing its job. No one drinks from it. That is not the point. The point is that weather should have somewhere to arrive that is not a problem. The village invented this without a meeting. Cups appeared. They stayed. Glaze crazed into maps of no coast. A chip on one rim is famous in a very small way, which is to say two households know which chip it is. The cup does not belong to the fog and does not belong to the house. It belongs to the sill, which is a country of its own. Tonight the cup is beaded and quiet. Weather has been received.",
  },
  {
    id: "archipelago.lantern",
    title: "Lantern glass, the same story",
    kind: "body",
    text: "Lantern glass beads with the same story every evening. Condensation writes it in a hand that cannot be taught. The story is not a plot. It is the record of warmth meeting wet air, of a wick doing what wicks do, of glass remembering it is thinner than weather. People here do not wipe the glass immediately. Wiping too soon is considered a kind of interrupting. Let the beads complete their sentence. Let the light go coin-shaped and soft. The lanterns are not for seeing far. They are for making the fog furniture have edges. A child of this place, grown now or not, would know the difference between a lantern that has been allowed its beads and a lantern that has been polished into loneliness. The village prefers the first. Oil is measured. Wicks are trimmed without performance. The same story beads again. No one is tired of it. Repetition, in the archipelago, is how a night becomes a place rather than an event.",
  },
  {
    id: "archipelago.whale",
    title: "A whale, by the windows",
    kind: "body",
    text: "A whale is passing, known only by the way windows stop rattling. There is no sighting. There is a change in the argument the air has been having with the frames. Then the argument pauses. Then it resumes more quietly, as if something large had taken a share of the weather and moved on with it. Fog whales are spoken of the way tides are spoken of: not as marvels, as furniture of a larger room. No one goes to the water to confirm. Confirmation would be a mainland hunger. Here it is enough that the windows have stopped, and then started, and that the starting is gentler. A cup on a sill does not spill. Nets do not swing. The village, which has always been in mist, treats the passage as a courtesy from a neighbor who does not knock. If there is a body out there it is the body of water thinking in a slower grammar. The windows, having been still, go back to their small work of being glass. Nothing is pursued. The whale, if it was a whale, keeps the offing.",
  },
  {
    id: "archipelago.tides",
    title: "Tide tables as literature",
    kind: "body",
    text: "Tide tables are treated as literature. They hang in the post-room and in kitchens, not because anyone has forgotten how water behaves, but because the columns have a rhythm that is pleasant to look at while waiting for a kettle. High, low, the small numbers that differ by a hand’s width, the days marching without being days of appointment. People here read them the way some places read shipping forecasts: as sentences that happen to be true. A child learning to read might learn tides before stories with villains, which would be considered an advantage. The paper curls at the corners from fog that has furniture. No one laminates it. Laminating would make the tides look like they needed protecting from the thing they describe. Pencil marks in the margin are not reminders. They are underlinings of a favorite line, a particularly neat low water, a spring tide that arrived like a paragraph with good cadence. The village does not hurry the water. The tables do not hurry the village. They keep one another company on the wall.",
  },
  {
    id: "archipelago.hinge",
    title: "Oil for a carrying sound",
    kind: "body",
    text: "Someone is oiling a hinge because sound carries strangely here. A dry hinge would travel the lane as a sentence too sharp for the fog’s furniture. Oil makes it a murmur. The work takes longer than it would inland, not because the hinge is difficult, but because the person doing it listens after each drop. The fog sits on the step and does not help and does not hinder. A cloth. A small can. The particular attention of a place that has decided noise should be neighborly. When the hinge is satisfied it will open as if it had always meant to. Doors here are not slammed. Slamming would arrive in three kitchens at once and be mistaken for weather. The oiler knows this without making a proverb of it. Down the lane a lantern beads its usual story. The ferry horn, if it is coming, has not come yet. The hinge receives another drop. Excess oil is wiped, because drips on stone become a different kind of sentence. The village, which developed a culture of not rushing weather, also does not rush hardware.",
  },
  {
    id: "archipelago.path",
    title: "A path that waits for thinning",
    kind: "body",
    text: "The path between houses exists only when the fog thins. The rest of the time it is an agreement. People walk it anyway, by the feel of cobbles and by the way lanterns stand in a known order. When the fog thins, the path is suddenly a path, with edges, with a puddle that had been theoretical. Children of this weather learn both versions and do not prefer the visible one as if it were more honest. Honesty, here, includes the unseen route. A rope handrail appears for a stretch and then is only rope in fog, which is still a handrail if you have your hand on it. The houses keep their distances. Too close would make the village a single damp room. Too far would make the path a journey, and journeys are for other islands. Between: this intermittent lane. A cat, if there is a cat, uses it in all weathers and is considered an expert. Tonight the path is mostly agreement. That is enough. The cobbles remember being a path and will prove it when asked by clearer air.",
  },
  {
    id: "archipelago.radio",
    title: "Static as a neighbor",
    kind: "horn",
    text: "Radio static is considered a kind of neighbor. It lives in a set with a cracked knob in the post-room, and sometimes in kitchens where the fog is furniture and company is welcome in non-human form. The static is not trying to become a voice. If a voice arrives it is treated as a visitor; the static is the one who lives here. People have named it, privately, the way one names a boat without a ceremony. It hushes and hushes and occasionally contains a syllable from a far language that may be weather. No one turns it off for silence. Silence in the archipelago already has enough furniture. The static fills a particular corner of hearing that would otherwise listen too hard for the ferry. It is a kindness. Volume stays low. The cracked knob is left where it is, because finding the perfect place would be a mainland project. The village, which does not rush weather, also does not rush reception. The neighbor continues. Windows do not rattle. The static, being a neighbor, does not need to come in.",
  },
  {
    id: "archipelago.salt",
    title: "Salt in the door lock",
    kind: "body",
    text: "There is salt in the door lock. There is always salt in the door lock. It is not a failure of housekeeping. It is the sea practicing a small occupation, grain by grain, in the only mechanism that pretends to keep things apart. People oil the lock as they oil hinges, listening. The key still turns. The turn has a catch in it that everyone knows, a little gravel of the ocean. Visitors, on the rare days visitors exist, think the lock is broken. It is not broken. It is accurate. The door closes. The fog remains on both sides, which makes the lock’s job philosophical. Still, the village locks what it locks, out of habit and out of respect for the idea of a house. Salt will return by morning. A cloth will be used, or not. The pilings out in the water have the same white at their high mark. Continuity is a comfort when it arrives as mineral. The lock, having been turned, rests. The salt, having been noticed, continues its quiet work of reminding wood and iron where they are.",
  },
  {
    id: "archipelago.close",
    title: "Not a destination tonight",
    kind: "close",
    text: "The archipelago decides not to become a destination tonight. This is an old decision and it is made again without a meeting. The fog keeps its furniture. The ferry horn, whether memory or metal, keeps its distance. Nets dry under a roof that is also fog. Tide tables remain literature. No one is expected from the mainland, which is a rumour with a timetable, and rumours can wait. Windows have rattled and then not rattled and then gone back to being glass. The village, whose people developed a culture of not rushing weather, extends that courtesy to the night itself. Lanterns bead the same story. A cup on a sill receives what it is given. Salt stays in the lock. The path between houses remains mostly an agreement. Nothing is lost by not being visited. The islands are not lonely; they are occupied by mist and custom and the slow water against pilings. Having decided, the archipelago does not post a notice. It simply continues, muffled and communal at a distance, which is how it prefers to be known, when it is known at all.",
  },
];

const houseScenes: SceneCard[] = [
  {
    id: "house.table",
    title: "The hall table’s patience",
    kind: "place",
    text: "The hall table practices patience as its main occupation. It holds what is put on it and does not suggest a next action. An envelope may live here. A key. A stone that was interesting in daylight and is now only a stone. The wood has a dull shine from years of sleeves. Nothing on the table is late. Nothing on the table is early. The house, which already knows the weather of a week without knowing a name, lets the table be the place where the week can rest without being read aloud. Dust takes the long way around a saucer. The runner is slightly crooked and has been slightly crooked long enough to be considered straight. From the kitchen, a leftover warmth arrives and is not a message. The table receives it the way it receives everything: by remaining a table. Patience, here, is not a virtue. It is a surface. Things can wait on it until they are no longer things that needed waiting, which is a kind of weather too.",
  },
  {
    id: "house.coats",
    title: "Coats before their weather",
    kind: "body",
    text: "Coats have arrived before their weather. They hang on the banister as if the banister were a forecast. Wool, a sleeve turned inside out at the cuff, a button that has been sewn on with a slightly different thread. The house does not mind the early coats. A house that knows a week’s weather knows also that weather is often early in the hall and late at the door. The banister takes the weight. The stair well holds a smell of rain that has not yet happened, or of rain that happened in another season and stayed in the cloth. No one is going out. The coats understand this and still perform the shape of going out, which is useful, like keeping a cup on a hook. A pocket holds a ticket stub so faded it has become textile. The house will not pick it. Coats before their weather are a kindness the hall does for the rest of the rooms: they keep the idea of outside from having to come all the way in.",
  },
  {
    id: "house.cup",
    title: "A second cup for the weekend",
    kind: "body",
    text: "A second cup has been assigned to the weekend and then left. It sits beside the everyday cup with an air of being extra, which is a delicate air and easily crushed by being washed too soon. The house lets it remain. Weekends, in this house, are not a calendar. They are a second cup. The glaze does not match. That is the point. Someone once thought there would be two breakfasts of a slower kind, and the thought became crockery. The thought can wait. The kitchen window is fogged from something already finished, soup or a kettle or simply the room breathing on cold glass. The second cup faces the window as if the weekend might come in that way. It will not. It will come, if it comes, as a lightness in the house’s joints, a permission not to be needed. The cup is ready for that permission and does not nag. Extra chairs will be wrong in the morning; extra cups are allowed to be right in advance.",
  },
  {
    id: "house.photo",
    title: "Nobody facing the camera",
    kind: "body",
    text: "The photograph on the mantel shows a kitchen after rain. Nobody in it is facing the camera. This is the house’s favorite fact about the picture, though the house does not have favorites so much as habits. A shoulder. The edge of a table. Light on a wet sill. The people, if they are people, have already turned back into the room, which is where rooms prefer people to be. The frame is a little too large, a margin of dark cardboard like a pause. Dust on the glass is part of the composition now. No one will clean it in a hurry. The house, which keeps a week without reading it aloud, keeps this picture the same way: as weather that has already happened and does not need names. Sometimes the mantel clock is not wound, which makes the photograph even more the thing that tells time, and what it tells is that time can face away. The kitchen in the picture is not this kitchen, or it is this kitchen from a season the pipes remember.",
  },
  {
    id: "house.pipes",
    title: "Pipes in another language",
    kind: "body",
    text: "The pipes talk in a language that is not news. It is older than news and less interested in events. A tick in the wall when heat considers the radiators. A longer comment when water is asked to climb. Iron somewhere in the joints. The house translates none of this into appointments. Translation would make the pipes anxious, and pipes should not be anxious. They should be mineral and slightly opinionated and left to their dialects. In winter the dialect includes a thin whistle. In other seasons it is mostly ticks, like knitting needles in another room. A pan left to cool on the stove answers once, a click, which the pipes appear to respect. No one needs to know what was said. The house already knows the weather of the week; the pipes know the weather of the walls, which is a smaller country with its own postage. Listening is optional. The pipes will talk whether they are listened to or not, which is how a language remains a language.",
  },
  {
    id: "house.kitchen",
    title: "Glass fogged from something finished",
    kind: "body",
    text: "The kitchen window is fogged from something already finished. A kettle. A pan. The simple work of a room that has been warmer than the glass. The fog on the pane is not weather from outside; it is the house’s own breath made visible and then left. No one wipes a viewing hole. There is nothing outside that needs to be checked. Coats on the banister have that job, if it is a job. The sink holds a plate that will keep. The tap has a slow bead that has not decided to drop. When it drops, the pipes will mention it in their language that is not news. The window’s fog thins at the corners first, as fog on glass always does, drawing a map of the pane’s secret drafts. The house likes this map. It is accurate and temporary. Somewhere a moth prefers a porch, but the kitchen has its own small wildlife of ticks and cooling metal. Something was cooked or boiled or merely thought about with heat. It is finished. The glass records the finishing without making it a story.",
  },
  {
    id: "house.stairs",
    title: "Stairs that count slower",
    kind: "body",
    text: "The stairs count slower after the house has gone quiet, without announcing any hour. Each tread has a number the feet used to know, and now the numbers arrive with more space between them. The banister, busy with coats, still offers a rail. A step near the top has always complained, a polite complaint, wood on a nail that has ideas. The house does not fix it. The complaint is how the stairs say they are still stairs. Going up is not a task. Going down is not a task. Both are a way of letting the hall and the upper rooms remember they are related. A spare chair waits on the landing, which is the wrong room on purpose. The stairs accept the chair as a landing’s right. No light is turned on; enough comes from wherever enough comes from. The counting continues, slower, as if each number had to be borrowed from a neighbor. The house, which does not read a week aloud, also does not read the stairs aloud. They count for themselves.",
  },
  {
    id: "house.letter",
    title: "A letter that thought better",
    kind: "body",
    text: "A letter thought better of being opened and remains itself on the hall table. The envelope is the color of indoor weather. The flap is still a flap. Whatever is inside can continue being inside, which is a complete occupation. The house is glad. Letters that wait are often kinder than letters that arrive all at once into a kitchen. The table practices patience around it. A stone keeps one corner from lifting in a draft that may be imagined. No name is needed on the front for the house to know the letter is part of the week’s weather, the way rain is, the way an extra cup is. Opening would be a kind of morning. The house is not in a morning. The letter, having thought better, does not sulk. It rests. Tomorrow, which the house will not name, the letter will still be there, and that continuity is the whole mercy of hall tables. Coats on the banister do not look at it. The photograph on the mantel faces away, as always. The letter is among friends.",
  },
  {
    id: "house.chair",
    title: "The spare chair, wrong room",
    kind: "body",
    text: "A spare chair stands in the wrong room on purpose. The purpose is not a secret: the house sometimes needs a chair to be extra the way it needs a cup to be extra, as a rehearsal for gathering that may not occur. The chair is good. It is not the best chair. Best chairs stay where they have always stayed. This one has been promoted to the hall, or demoted to the hall, depending on how one feels about halls. A coat has slipped a sleeve over its back, which makes the chair look briefly like a person who has decided not to sit. The house allows the resemblance and does not pursue it. Legs rest on a runner that is slightly crooked. The chair does not correct the runner. Wrong-room-ness is a kind of hospitality that does not require guests. If gathering comes, the chair will be almost in the way and then useful. If gathering does not come, the chair will have been useful already, as a thought the house had and then left in the hall to finish thinking.",
  },
  {
    id: "house.porch",
    title: "The porch and the road",
    kind: "body",
    text: "The porch decides the road does not mean anything tonight. This is within a porch’s rights. A porch is the house’s opinion about outside, and tonight the opinion is that the road can continue without being a plan. Wet rail. One chair at an angle. A moth working a bulb and then resting, as moths do when they have understood the bulb. Boards smell faintly of coats that will be needed in some other weather, or of coats that hung here and took the smell away with them. The road, if it is out there, is a darker line with no errand. The house, which already knows the week, does not send the porch any instructions. The porch is trusted to keep the road at the rank of scenery. A bead of water travels the rail and drops into a geranium that may be plastic and is not ashamed. Wind, if there is wind, uses the angle of the chair as a small harp and then thinks better of music. The porch holds. The road, meaning nothing, is free to be a road.",
  },
  {
    id: "house.dust",
    title: "Dust in a remembered sun",
    kind: "body",
    text: "Dust hangs in a sun that is not present, only remembered. The house keeps a particular slant in the front room, a gold that used to arrive and has left its mannerisms behind. Motes use those mannerisms. They rise as if warmed. They are not warmed. They are practicing. This is not sadness. The house is good at practice. A shelf of unnamed objects participates by being still. The photograph on the mantel, nobody facing the camera, would understand. Memory of light is still a kind of light if one is dust, or a house, or a week that does not need to be read aloud. A curtain moves two centimeters and returns, which is enough wind to prove the room has an outside. The motes adjust and continue their old choreography. No one will wipe the shelf in this hour. Wiping would end the rehearsal. The house prefers the rehearsal. It is how late summer stays in the plaster after late summer has gone, and how winter, when it comes, will find a place already trained to hold a slant of something.",
  },
  {
    id: "house.close",
    title: "The house keeps the week",
    kind: "close",
    text: "The house keeps the listener’s week without reading it aloud. That is the whole of the arrangement. Coats may have arrived before their weather. A letter may have thought better. A second cup may still be assigned to a slower morning that has not been named. None of this is announced. The pipes talk in a language that is not news. The hall table practices patience. The porch has decided the road does not mean anything for now. Stairs count slower. A photograph faces away. The house does not require a recap, a moral, or a plan. It is enough to be the rooms in which a week can set itself down and become indoor weather. If tomorrow has an early fire in it, the stove will consider that in its own time. If rain is coming, the windows already know how to think in rivers. For this hour the house simply remains, oblique and tender, never specific, a place that can hold a life without putting it into sentences. The week is kept. It is not read. That is the kindness.",
  },
];

export const worlds: Record<WorldId, WorldDef> = {
  lookout: {
    id: "lookout",
    name: "The Lookout",
    tagline: "A cabin that keeps watch without reporting.",
    bible:
      "A mountain cabin used as a refuge for hikers. Wood stove, quilt, west window, a slope with a cracked apricot barrel. Tone: dry, kind, specific objects, no adventure. Banned: clock time, wolves, rescue plots, second person, questions to the listener, suspense, morals.",
    scenes: lookoutScenes,
  },
  archipelago: {
    id: "archipelago",
    name: "Fog Archipelago",
    tagline: "Villages that have always been in mist.",
    bible:
      "Villages always in mist. Fog whales out of sight. Boats that do not go far. A culture of not rushing weather. Tone: maritime, muffled, communal at a distance, never lonely-horror. Banned: shipwreck drama, monsters, lost children, horror fog, second person, questions, clock time.",
    scenes: archipelagoScenes,
  },
  house: {
    id: "house",
    name: "The House",
    tagline: "A house that knows the weather of a week, not a name.",
    bible:
      "A house that already knows the weather of the listener’s week without knowing their name. Hall table, extra cup, coats, a letter that can wait. Tone: domestic, oblique, tender, never specific. Banned: proper names, cities, workplaces, medical or financial facts, clock times, dates, second person, questions, morals, emails, calendars.",
    scenes: houseScenes,
  },
};

export const worldList: WorldDef[] = [worlds.lookout, worlds.archipelago, worlds.house];
