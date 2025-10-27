-- 清空现有文章模板，以防重复插入
DELETE FROM article_templates;

-- 插入10篇通用文章模板
INSERT INTO article_templates (title, content, word_bank_json, difficulty, type, created_at) VALUES
('The Power of Reading',
'Reading is one of the most [valuable] activities we can engage in. It helps us [expand] our knowledge and understand different perspectives. Through books, we can [explore] worlds we''ve never seen and learn from the [experiences] of others. Regular reading can [improve] our vocabulary and writing skills significantly. It also helps us develop [critical] thinking abilities. Many successful people [attribute] their achievements to the habit of reading. Whether it''s fiction or non-fiction, every book offers something [unique] to discover.',
'[{"word": "valuable", "meaning": "有价值的"}, {"word": "expand", "meaning": "扩展，扩大"}, {"word": "explore", "meaning": "探索"}, {"word": "experiences", "meaning": "经历，经验"}, {"word": "improve", "meaning": "提高，改善"}, {"word": "critical", "meaning": "批判性的，关键的"}, {"word": "attribute", "meaning": "归因于"}, {"word": "unique", "meaning": "独特的"}]',
'intermediate', 'GENERIC', NOW()),

('Building Good Habits',
'Developing good habits is [essential] for personal growth. Small daily actions can [accumulate] into significant changes over time. The key is to start with [manageable] goals and be [consistent]. Many people fail because they try to change everything at once. Instead, focus on one habit at a time and [maintain] it for at least 21 days. This [approach] helps your brain adapt to the new behavior. Remember that [progress] is more important than perfection. Even small improvements can lead to [remarkable] results in the long run.',
'[{"word": "essential", "meaning": "必要的，本质的"}, {"word": "accumulate", "meaning": "积累"}, {"word": "manageable", "meaning": "可管理的"}, {"word": "consistent", "meaning": "一致的，坚持的"}, {"word": "maintain", "meaning": "维持，保持"}, {"word": "approach", "meaning": "方法，途径"}, {"word": "progress", "meaning": "进步，进展"}, {"word": "remarkable", "meaning": "显著的，非凡的"}]',
'intermediate', 'GENERIC', NOW()),

('The Future of Technology',
'Technology continues to [transform] our daily lives in unexpected ways. Artificial intelligence is becoming more [sophisticated] and can now perform tasks that once required human intelligence. The [integration] of smart devices has made our homes more convenient and efficient. However, we must also consider the [implications] of these rapid changes. Privacy concerns and job [displacement] are real challenges we need to address. Despite these concerns, technology offers [tremendous] opportunities for solving global problems. The key is to use these tools [responsibly] and ensure they benefit all of humanity.',
'[{"word": "transform", "meaning": "转变，改变"}, {"word": "sophisticated", "meaning": "复杂的，精密的"}, {"word": "integration", "meaning": "整合，融合"}, {"word": "implications", "meaning": "影响，含义"}, {"word": "displacement", "meaning": "取代，替换"}, {"word": "tremendous", "meaning": "巨大的"}, {"word": "responsibly", "meaning": "负责任地"}, {"word": "benefit", "meaning": "使受益，好处"}]',
'intermediate', 'GENERIC', NOW()),

('Exploring New Cultures',
'Traveling to different countries allows us to [immerse] ourselves in new cultures. We learn to [appreciate] diverse traditions and ways of life. This exposure helps us become more [tolerant] and open-minded individuals. Language barriers can be [challenging], but they also provide opportunities to develop communication skills. Trying local cuisine is an [integral] part of understanding a culture''s identity. We should [embrace] these differences rather than judge them. Cultural exchange [enriches] our lives and broadens our worldview in meaningful ways.',
'[{"word": "immerse", "meaning": "沉浸"}, {"word": "appreciate", "meaning": "欣赏，感激"}, {"word": "tolerant", "meaning": "宽容的"}, {"word": "challenging", "meaning": "具有挑战性的"}, {"word": "integral", "meaning": "不可或缺的"}, {"word": "embrace", "meaning": "拥抱，接受"}, {"word": "enriches", "meaning": "丰富"}, {"word": "worldview", "meaning": "世界观"}]',
'intermediate', 'GENERIC', NOW()),

('Staying Healthy in Modern Life',
'Maintaining good health requires a [balanced] approach to diet and exercise. Modern lifestyles often [promote] sedentary behavior, which can lead to various health issues. Regular physical activity helps [strengthen] our immune system and improves mental well-being. It''s important to [prioritize] sleep and manage stress effectively. Eating [nutritious] foods provides our body with essential vitamins and minerals. We should also [minimize] processed foods and sugar intake. Small lifestyle changes can have a [profound] impact on our overall health and longevity.',
'[{"word": "balanced", "meaning": "平衡的"}, {"word": "promote", "meaning": "促进"}, {"word": "strengthen", "meaning": "加强"}, {"word": "prioritize", "meaning": "优先考虑"}, {"word": "nutritious", "meaning": "有营养的"}, {"word": "minimize", "meaning": "最小化"}, {"word": "profound", "meaning": "深远的"}, {"word": "longevity", "meaning": "长寿"}]',
'intermediate', 'GENERIC', NOW()),

('The Importance of Teamwork',
'Working effectively in teams is a [crucial] skill in today''s workplace. Good teamwork requires clear communication and mutual [respect]. Each team member brings unique strengths that [contribute] to the group''s success. Learning to [collaborate] helps us achieve goals that would be impossible alone. Conflicts may arise, but they can be [resolved] through open dialogue. A strong team [fosters] innovation and creativity. Leaders should [encourage] participation from all members and recognize individual contributions to maintain team [morale].',
'[{"word": "crucial", "meaning": "关键的"}, {"word": "respect", "meaning": "尊重"}, {"word": "contribute", "meaning": "贡献"}, {"word": "collaborate", "meaning": "合作"}, {"word": "resolved", "meaning": "解决"}, {"word": "fosters", "meaning": "培养，促进"}, {"word": "encourage", "meaning": "鼓励"}, {"word": "morale", "meaning": "士气"}]',
'intermediate', 'GENERIC', NOW()),

('Learning from Mistakes',
'Mistakes are [inevitable] parts of the learning process. Instead of feeling [discouraged], we should view them as opportunities for growth. Every error teaches us something [valuable] about ourselves and our approach. Successful people [acknowledge] their mistakes and learn from them quickly. It''s important to [analyze] what went wrong and develop strategies to avoid similar issues. This [mindset] transforms failures into stepping stones toward success. Remember that [perseverance] through difficulties builds character and resilience.',
'[{"word": "inevitable", "meaning": "不可避免的"}, {"word": "discouraged", "meaning": "气馁的"}, {"word": "valuable", "meaning": "有价值的"}, {"word": "acknowledge", "meaning": "承认"}, {"word": "analyze", "meaning": "分析"}, {"word": "mindset", "meaning": "心态"}, {"word": "perseverance", "meaning": "毅力，坚持"}, {"word": "resilience", "meaning": "韧性"}]',
'intermediate', 'GENERIC', NOW()),

('The Joy of Creativity',
'Creativity is not limited to artists; it''s a skill everyone can [cultivate]. Engaging in creative activities helps reduce stress and [enhance] mental well-being. Whether it''s painting, writing, or music, creative expression allows us to [communicate] emotions that words alone cannot capture. Regular practice helps [develop] our creative abilities over time. Don''t worry about being perfect; the process itself is [rewarding]. Creative thinking also helps us [solve] problems in innovative ways. Making time for creativity can [transform] our daily routine into something more fulfilling.',
'[{"word": "cultivate", "meaning": "培养"}, {"word": "enhance", "meaning": "增强"}, {"word": "communicate", "meaning": "交流"}, {"word": "develop", "meaning": "发展"}, {"word": "rewarding", "meaning": "有益的，值得的"}, {"word": "solve", "meaning": "解决"}, {"word": "transform", "meaning": "转变"}, {"word": "fulfilling", "meaning": "令人满足的"}]',
'intermediate', 'GENERIC', NOW()),

('Protecting Our Environment',
'Environmental protection is a [collective] responsibility that requires immediate action. Climate change poses [significant] threats to our planet''s future. We can make a difference through simple daily choices like reducing waste and [conserving] energy. Supporting [sustainable] practices helps preserve natural resources for future generations. Governments and businesses must [implement] stricter environmental policies. Individual actions, though small, can [accumulate] into meaningful change when many people participate. Education about environmental issues is [essential] for creating lasting solutions.',
'[{"word": "collective", "meaning": "集体的"}, {"word": "significant", "meaning": "重大的"}, {"word": "conserving", "meaning": "节约，保护"}, {"word": "sustainable", "meaning": "可持续的"}, {"word": "implement", "meaning": "实施"}, {"word": "accumulate", "meaning": "积累"}, {"word": "essential", "meaning": "必要的"}, {"word": "lasting", "meaning": "持久的"}]',
'intermediate', 'GENERIC', NOW()),

('Time Management Skills',
'Effective time management is [fundamental] to achieving our goals. Learning to [prioritize] tasks helps us focus on what truly matters. Many people struggle with [procrastination], which can be overcome through better planning. Creating a daily schedule helps [organize] our activities and reduces stress. It''s important to set [realistic] deadlines and break large projects into smaller tasks. Regular breaks actually [improve] productivity and prevent burnout. Remember that saying no to less important commitments allows us to [dedicate] more energy to our priorities.',
'[{"word": "fundamental", "meaning": "基本的"}, {"word": "prioritize", "meaning": "优先处理"}, {"word": "procrastination", "meaning": "拖延"}, {"word": "organize", "meaning": "组织"}, {"word": "realistic", "meaning": "现实的"}, {"word": "improve", "meaning": "提高"}, {"word": "dedicate", "meaning": "致力于"}, {"word": "priorities", "meaning": "优先事项"}]',
'intermediate', 'GENERIC', NOW());
