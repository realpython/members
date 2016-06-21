exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('chapters').del(),
    // Inserts seed entries
    knex('chapters').insert({
      order: 1,
      name: 'Functions and Loops',
      content: 'Salvia readymade chia hoodie. Direct trade VHS polaroid narwhal, sartorial forage street art farm-to-table fashion axe plaid schlitz jean shorts vice kinfolk four loko. Literally small batch typewriter, paleo cold-pressed brooklyn kinfolk beard seitan man braid street art irony. Helvetica skateboard kickstarter asymmetrical yuccie tilde hoodie, slow-carb post-ironic austin leggings waistcoat. Tattooed VHS kale chips artisan. Semiotics craft beer schlitz fashion axe truffaut selvage freegan tacos. Lumbersexual locavore sustainable, venmo put a bird on it flexitarian craft beer schlitz four dollar toast street art slow-carb chia synth knausgaard.'
    }),
    knex('chapters').insert({
      order: 2,
      name: 'Conditional logic',
      content: 'Photo booth forage locavore ugh. Church-key polaroid wayfarers, authentic echo park occupy leggings small batch fashion axe godard. Neutra meggings selfies small batch cred literally squid, trust fund shabby chic yr celiac ethical. Pickled tousled portland, freegan truffaut chia organic venmo echo park pork belly kitsch. Raw denim photo booth tote bag jean shorts 3 wolf moon blue bottle, gentrify mixtape intelligentsia. Polaroid farm-to-table heirloom, salvia everyday carry banh mi wolf gluten-free small batch. Mustache pitchfork tousled fixie deep v.'
    }),
    knex('chapters').insert({
      order: 3,
      name: 'Lists and Dictionaries',
      content: 'Gentrify yr dreamcatcher, try-hard echo park disrupt VHS tote bag four loko organic gastropub cornhole. Letterpress food truck migas, biodiesel synth godard chillwave dreamcatcher. Pickled hella fixie, DIY actually microdosing man bun. Readymade tacos paleo listicle pitchfork celiac, raw denim XOXO deep v pork belly. Pickled normcore four loko offal, fingerstache godard roof party swag franzen. Gastropub direct trade everyday carry wolf, typewriter man braid lomo knausgaard trust fund occupy. Fap yuccie thundercats, bushwick street art umami pitchfork austin kickstarter gastropub slow-carb typewriter wayfarers.'
    })
  );
};
