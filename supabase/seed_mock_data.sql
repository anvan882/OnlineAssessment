-- Seed: Clear existing test data and insert AI/ML mock topics with votes
-- Run this in the Supabase Dashboard SQL Editor

-- Clear existing data (votes first due to FK)
DELETE FROM public.votes;
DELETE FROM public.features;

-- Insert AI/ML/LLM feature requests with fake voter_ids
INSERT INTO public.features (id, title, description, voter_id, created_at) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Claude 4 Opus is solving 78% of real GitHub issues autonomously', 'The new SWE-bench verified results are incredible. Claude 4 Opus is solving 78.4% of real GitHub issues autonomously. This is a massive jump from the previous 49% that Claude 3.5 Sonnet achieved. The gap between AI and human-level coding is closing fast.', 'b1000000-0000-0000-0000-000000000001', now() - interval '2 hours'),

  ('a1000000-0000-0000-0000-000000000002', 'GPT-5 reportedly trained on 10x more compute than GPT-4', 'Leaked internal docs suggest GPT-5 used roughly 10x the compute budget of GPT-4. If true, we should expect a significant capability jump. The question is whether we are hitting diminishing returns on scaling or if there is still room to grow.', 'b1000000-0000-0000-0000-000000000002', now() - interval '4 hours'),

  ('a1000000-0000-0000-0000-000000000003', 'Why I switched from LangChain to just writing Python', 'After 6 months of fighting LangChain abstractions, I ripped it all out and replaced it with plain Python + httpx calls to the API. Code went from 2000 lines to 400. Debugging went from impossible to trivial. Sometimes the best framework is no framework.', 'b1000000-0000-0000-0000-000000000003', now() - interval '6 hours'),

  ('a1000000-0000-0000-0000-000000000004', 'Open-source models are catching up faster than expected', 'Llama 4 Scout is matching GPT-4o on most benchmarks now. Mixtral and Qwen are not far behind. The gap between open and closed models is shrinking every quarter. At this rate open-source will be good enough for 90% of production use cases by end of year.', 'b1000000-0000-0000-0000-000000000004', now() - interval '3 hours'),

  ('a1000000-0000-0000-0000-000000000005', 'RAG is dead, long live long context', 'With 1M+ token context windows becoming standard, do we even need RAG anymore? Just dump the entire knowledge base into the context. Yes it costs more, but the accuracy improvement is massive and you eliminate the entire retrieval pipeline.', 'b1000000-0000-0000-0000-000000000005', now() - interval '8 hours'),

  ('a1000000-0000-0000-0000-000000000006', 'AI coding assistants are making junior devs mass-produce technical debt', 'Hot take: AI assistants let juniors ship code 3x faster but they do not understand what they are shipping. We are seeing a massive increase in cargo-culted patterns, unnecessary abstractions, and copy-pasted solutions that nobody on the team can maintain.', 'b1000000-0000-0000-0000-000000000006', now() - interval '5 hours'),

  ('a1000000-0000-0000-0000-000000000007', 'Fine-tuning is massively underrated for production LLM apps', 'Everyone jumps to prompt engineering and RAG but fine-tuning on your own data gives you a 10x better result for domain-specific tasks. We fine-tuned Llama on our internal docs and it outperforms GPT-4 on our specific workflows at 1/50th the cost.', 'b1000000-0000-0000-0000-000000000007', now() - interval '7 hours'),

  ('a1000000-0000-0000-0000-000000000008', 'MCP protocol is going to standardize how AI agents interact with tools', 'Anthropic MCP is what HTTP was for the web. A standard protocol for AI agents to discover and call tools. Every major player is adopting it. This is the most important infra development in AI since transformers.', 'b1000000-0000-0000-0000-000000000008', now() - interval '1 hour'),

  ('a1000000-0000-0000-0000-000000000009', 'We need to stop benchmarking LLMs and start benchmarking workflows', 'MMLU, HumanEval, and other benchmarks are basically meaningless for real-world use. What matters is how well the model performs in YOUR workflow with YOUR data. A model that scores 5 points lower on benchmarks but follows instructions better is the winner.', 'b1000000-0000-0000-0000-000000000009', now() - interval '10 hours'),

  ('a1000000-0000-0000-0000-000000000010', 'The real cost of running LLMs in production is not what you think', 'Token costs are the tip of the iceberg. The real costs are: prompt engineering iteration time, handling hallucinations in production, building evaluation pipelines, and the ops burden of managing model version upgrades. Budget 5x what you think you need.', 'b1000000-0000-0000-0000-000000000010', now() - interval '9 hours');

-- Generate fake voter UUIDs for votes
-- Using a series of deterministic UUIDs for mock voters
-- Each voter votes on several features to create realistic patterns

-- Feature 1: Claude 4 Opus (highly upvoted — 47 up, 3 down)
INSERT INTO public.votes (feature_id, voter_id, vote_value)
SELECT 'a1000000-0000-0000-0000-000000000001', ('c' || lpad(i::text, 7, '0') || '-0000-0000-0000-000000000001')::uuid, 1
FROM generate_series(1, 47) AS s(i);
INSERT INTO public.votes (feature_id, voter_id, vote_value)
SELECT 'a1000000-0000-0000-0000-000000000001', ('d' || lpad(i::text, 7, '0') || '-0000-0000-0000-000000000001')::uuid, -1
FROM generate_series(1, 3) AS s(i);

-- Feature 2: GPT-5 compute (mixed — 31 up, 12 down)
INSERT INTO public.votes (feature_id, voter_id, vote_value)
SELECT 'a1000000-0000-0000-0000-000000000002', ('c' || lpad(i::text, 7, '0') || '-0000-0000-0000-000000000002')::uuid, 1
FROM generate_series(1, 31) AS s(i);
INSERT INTO public.votes (feature_id, voter_id, vote_value)
SELECT 'a1000000-0000-0000-0000-000000000002', ('d' || lpad(i::text, 7, '0') || '-0000-0000-0000-000000000002')::uuid, -1
FROM generate_series(1, 12) AS s(i);

-- Feature 3: Ditching LangChain (popular — 89 up, 14 down)
INSERT INTO public.votes (feature_id, voter_id, vote_value)
SELECT 'a1000000-0000-0000-0000-000000000003', ('c' || lpad(i::text, 7, '0') || '-0000-0000-0000-000000000003')::uuid, 1
FROM generate_series(1, 89) AS s(i);
INSERT INTO public.votes (feature_id, voter_id, vote_value)
SELECT 'a1000000-0000-0000-0000-000000000003', ('d' || lpad(i::text, 7, '0') || '-0000-0000-0000-000000000003')::uuid, -1
FROM generate_series(1, 14) AS s(i);

-- Feature 4: Open-source catching up (well-liked — 62 up, 8 down)
INSERT INTO public.votes (feature_id, voter_id, vote_value)
SELECT 'a1000000-0000-0000-0000-000000000004', ('c' || lpad(i::text, 7, '0') || '-0000-0000-0000-000000000004')::uuid, 1
FROM generate_series(1, 62) AS s(i);
INSERT INTO public.votes (feature_id, voter_id, vote_value)
SELECT 'a1000000-0000-0000-0000-000000000004', ('d' || lpad(i::text, 7, '0') || '-0000-0000-0000-000000000004')::uuid, -1
FROM generate_series(1, 8) AS s(i);

-- Feature 5: RAG is dead (controversial — 38 up, 41 down)
INSERT INTO public.votes (feature_id, voter_id, vote_value)
SELECT 'a1000000-0000-0000-0000-000000000005', ('c' || lpad(i::text, 7, '0') || '-0000-0000-0000-000000000005')::uuid, 1
FROM generate_series(1, 38) AS s(i);
INSERT INTO public.votes (feature_id, voter_id, vote_value)
SELECT 'a1000000-0000-0000-0000-000000000005', ('d' || lpad(i::text, 7, '0') || '-0000-0000-0000-000000000005')::uuid, -1
FROM generate_series(1, 41) AS s(i);

-- Feature 6: AI coding = tech debt (polarizing — 55 up, 32 down)
INSERT INTO public.votes (feature_id, voter_id, vote_value)
SELECT 'a1000000-0000-0000-0000-000000000006', ('c' || lpad(i::text, 7, '0') || '-0000-0000-0000-000000000006')::uuid, 1
FROM generate_series(1, 55) AS s(i);
INSERT INTO public.votes (feature_id, voter_id, vote_value)
SELECT 'a1000000-0000-0000-0000-000000000006', ('d' || lpad(i::text, 7, '0') || '-0000-0000-0000-000000000006')::uuid, -1
FROM generate_series(1, 32) AS s(i);

-- Feature 7: Fine-tuning underrated (liked — 71 up, 5 down)
INSERT INTO public.votes (feature_id, voter_id, vote_value)
SELECT 'a1000000-0000-0000-0000-000000000007', ('c' || lpad(i::text, 7, '0') || '-0000-0000-0000-000000000007')::uuid, 1
FROM generate_series(1, 71) AS s(i);
INSERT INTO public.votes (feature_id, voter_id, vote_value)
SELECT 'a1000000-0000-0000-0000-000000000007', ('d' || lpad(i::text, 7, '0') || '-0000-0000-0000-000000000007')::uuid, -1
FROM generate_series(1, 5) AS s(i);

-- Feature 8: MCP protocol (very popular — 104 up, 6 down)
INSERT INTO public.votes (feature_id, voter_id, vote_value)
SELECT 'a1000000-0000-0000-0000-000000000008', ('c' || lpad(i::text, 7, '0') || '-0000-0000-0000-000000000008')::uuid, 1
FROM generate_series(1, 104) AS s(i);
INSERT INTO public.votes (feature_id, voter_id, vote_value)
SELECT 'a1000000-0000-0000-0000-000000000008', ('d' || lpad(i::text, 7, '0') || '-0000-0000-0000-000000000008')::uuid, -1
FROM generate_series(1, 6) AS s(i);

-- Feature 9: Stop benchmarking (moderate — 29 up, 18 down)
INSERT INTO public.votes (feature_id, voter_id, vote_value)
SELECT 'a1000000-0000-0000-0000-000000000009', ('c' || lpad(i::text, 7, '0') || '-0000-0000-0000-000000000009')::uuid, 1
FROM generate_series(1, 29) AS s(i);
INSERT INTO public.votes (feature_id, voter_id, vote_value)
SELECT 'a1000000-0000-0000-0000-000000000009', ('d' || lpad(i::text, 7, '0') || '-0000-0000-0000-000000000009')::uuid, -1
FROM generate_series(1, 18) AS s(i);

-- Feature 10: Real cost of LLMs (liked — 43 up, 7 down)
INSERT INTO public.votes (feature_id, voter_id, vote_value)
SELECT 'a1000000-0000-0000-0000-000000000010', ('c' || lpad(i::text, 7, '0') || '-0000-0000-0000-000000000010')::uuid, 1
FROM generate_series(1, 43) AS s(i);
INSERT INTO public.votes (feature_id, voter_id, vote_value)
SELECT 'a1000000-0000-0000-0000-000000000010', ('d' || lpad(i::text, 7, '0') || '-0000-0000-0000-000000000010')::uuid, -1
FROM generate_series(1, 7) AS s(i);
