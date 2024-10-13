"use client";

import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  CircularProgressLabel,
  Grid,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
// import LoadingModal from "./components/loading-modal";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@/app/components/modal";
import { useProfileStore } from "@utils/stores/profile";
import { useSearchQueryStore } from "@utils/stores/search";
import { useRouter } from "next/navigation";
import { IoArrowBack, IoRefresh } from "react-icons/io5";
import DistributionGraph from "./components/distribution-graph";
import SwarmGraph from "./components/swarm-graph";

interface UserPostProps {
  name: string;
  handle: string;
  reply: string;
  sentiment: number;
}

const UserPost = ({ name, handle, reply, sentiment }: UserPostProps) => {
  const getColor = (sentiment: number) => {
    const r = Math.round(255 * (1 - sentiment));
    const g = Math.round(255 * sentiment);
    return `rgba(${r}, ${g}, 0, 1)`;
  };

  return (
    <HStack
      alignItems="flex-start"
      p={4}
      bg="rgba(255,255,255,0.05)"
      borderRadius="xl"
      border="1px solid rgba(255,255,255,0.2)"
      w="full"
      maxW="500px"
      justify="space-between"
      backdropFilter="blur(5px)"
    >
      <HStack>
        <Avatar name={handle} size="sm" mr={2} />
        <VStack align="flex-start">
          <HStack spacing={2}>
            <HStack spacing={1}>
              <Text fontSize="sm" fontWeight="bold">
                {name}
              </Text>
              <Image src="verified.svg" alt="verified" w={4} h={4} />
            </HStack>
            <Text fontSize="xs" color="gray.400">
              {handle}
            </Text>
          </HStack>
          <Text fontSize="sm">{reply}</Text>
        </VStack>
      </HStack>
      <CircularProgress
        value={sentiment * 100}
        color={getColor(sentiment)}
        trackColor="rgba(150,150,150,0.2)"
        size="40px"
      >
        <CircularProgressLabel color="white" fontSize="3xs">
          {Math.round(sentiment * 100)}%
        </CircularProgressLabel>
      </CircularProgress>
    </HStack>
  );
};

interface QueryPostProps {
  name: string;
  handle: string;
  content: string;
}

const QueryPost = ({ name, handle, content }: QueryPostProps) => {
  return (
    <HStack
      alignItems="flex-start"
      p={4}
      bg="rgba(255,255,255,0.05)"
      borderRadius="xl"
      border="1px solid rgba(255,255,255,0.2)"
      w="full"
      maxW="500px"
      backdropFilter="blur(5px)"
    >
      <Avatar name={handle} size="sm" mr={2} />
      <VStack align="flex-start">
        <HStack spacing={2}>
          <HStack spacing={1}>
            <Text fontSize="sm" fontWeight="bold">
              {name}
            </Text>
            <Image src="verified.svg" alt="verified" w={4} h={4} />
          </HStack>
          <Text fontSize="xs" color="gray.400">
            {handle}
          </Text>
        </HStack>
        <Text fontSize="sm">{content}</Text>
      </VStack>
    </HStack>
  );
};

interface GraphsProps {
  posts: any;
  startScore: number | null;
  endScore: number | null;
  setStartScore: (score: number | null) => void;
  setEndScore: (score: number | null) => void;
}

const Graphs = ({
  posts,
  startScore,
  endScore,
  setStartScore,
  setEndScore,
}: GraphsProps) => {
  const [selectedGraph, setSelectedGraph] = useState("distribution");

  const resetScores = () => {
    setStartScore(null);
    setEndScore(null);
  };

  return (
    <VStack w="full" h="50vh">
      <HStack w="full" justify="space-between">
        <HStack px={4} spacing={4}>
          <Button
            size="xs"
            bg="rgba(255,255,255,0.4)"
            onClick={resetScores}
            _hover={{ bg: "rgba(255,255,255,0.6)" }}
            borderRadius="full"
            leftIcon={<IoRefresh fontSize="0.9rem" />}
          >
            Reset
          </Button>
          <Text
            fontSize="xs"
            color="gray.400"
            display={startScore && !endScore ? "block" : "none"}
          >
            Sampling starting {startScore}
          </Text>

          <Text
            fontSize="xs"
            color="gray.400"
            display={startScore && endScore ? "block" : "none"}
          >
            Sampling between {startScore} and {endScore}
          </Text>
        </HStack>

        <ButtonGroup isAttached>
          <Button
            size="xs"
            variant={selectedGraph === "distribution" ? "solid" : "outline"}
            onClick={() => setSelectedGraph("distribution")}
            bg={
              selectedGraph === "distribution"
                ? "rgba(255,255,255,0.2)"
                : "transparent"
            }
          >
            Distribution
          </Button>
          <Button
            size="xs"
            variant={selectedGraph === "swarm" ? "solid" : "outline"}
            onClick={() => setSelectedGraph("swarm")}
            bg={
              selectedGraph === "swarm"
                ? "rgba(255,255,255,0.2)"
                : "transparent"
            }
          >
            Quantity
          </Button>
        </ButtonGroup>
      </HStack>
      <Box w="full" h="full">
        {selectedGraph === "distribution" && (
          <DistributionGraph
            posts={posts}
            startScore={startScore}
            endScore={endScore}
            setStartScore={setStartScore}
            setEndScore={setEndScore}
          />
        )}
        {selectedGraph === "swarm" && (
          <SwarmGraph
            posts={posts}
            startScore={startScore}
            endScore={endScore}
            setStartScore={setStartScore}
            setEndScore={setEndScore}
          />
        )}
      </Box>
    </VStack>
  );
};

const BackgroundImage = () => {
  return (
    <Box
      position="absolute"
      top={0}
      right={0}
      w="100%"
      height="100%"
      // height="300px"
      zIndex={-1}
      backgroundImage="url('/bg-3.png')"
      backgroundSize="cover"
      backgroundPosition="center top"
      _after={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
          "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,1))",
      }}
    />
  );
};

export default function DashPage() {
  const [dataLoading, setDataLoading] = useState(true);
  const router = useRouter();

  const [startScore, setStartScore] = useState<number | null>(null);
  const [endScore, setEndScore] = useState<number | null>(null);
  const [isAllPostsModalOpen, setIsAllPostsModalOpen] = useState(false);
  const { handle } = useProfileStore();
  const { searchQuery } = useSearchQueryStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }
    hasInitialized.current = true;

    const handleSendQuery = async () => {
      console.log(handle);
      console.log(searchQuery);
    };

    handleSendQuery();

    setTimeout(() => {
      setDataLoading(false);
    }, 3000);
  }, []);

  const posts = [
    {
      name: "Rag Pil",
      handle: "@rag_pil",
      reply: "This is amazing! I love this!",
      sentiment: 1.0,
    },
    {
      name: "Tech Enthusiast",
      handle: "@tech_enthusiast",
      reply: "Incredible innovation! Can't wait to see more.",
      sentiment: 0.9,
    },
    {
      name: "Skeptic",
      handle: "@skeptic123",
      reply: "I'm not convinced. Needs more evidence.",
      sentiment: 0.2,
    },
    {
      name: "Future Thinker",
      handle: "@future_thinker",
      reply: "This could revolutionize the industry!",
      sentiment: 0.8,
    },
    {
      name: "Pragmatic User",
      handle: "@pragmatic_user",
      reply: "Interesting concept, but how practical is it?",
      sentiment: 0.5,
    },
    {
      name: "Innovator X",
      handle: "@innovator_x",
      reply: "Brilliant execution of a complex idea.",
      sentiment: 0.9,
    },
    {
      name: "Cautious Observer",
      handle: "@cautious_observer",
      reply: "Let's not get ahead of ourselves. Still many questions.",
      sentiment: 0.3,
    },
    {
      name: "Excited Newbie",
      handle: "@excited_newbie",
      reply: "Mind-blowing! This is why I love technology!",
      sentiment: 1.0,
    },
    {
      name: "Industry Veteran",
      handle: "@industry_veteran",
      reply: "Seen similar ideas fail. Not optimistic.",
      sentiment: 0.1,
    },
    {
      name: "Curious Mind",
      handle: "@curious_mind",
      reply: "Fascinating approach! How does it handle [specific scenario]?",
      sentiment: 0.7,
    },
    {
      name: "Tech Critic",
      handle: "@tech_critic",
      reply: "Overhyped. Doesn't solve the real problem.",
      sentiment: 0.0,
    },
    {
      name: "Forward Thinker",
      handle: "@forward_thinker",
      reply: "This could be a game-changer for our field!",
      sentiment: 0.9,
    },
    {
      name: "Practical Dev",
      handle: "@practical_dev",
      reply: "Solid implementation. Looking forward to testing it.",
      sentiment: 0.8,
    },
    {
      name: "UI Lover",
      handle: "@ui_lover",
      reply: "The interface is so intuitive! Great user experience.",
      sentiment: 1.0,
    },
    {
      name: "Security Expert",
      handle: "@security_expert",
      reply: "Promising, but what about the security implications?",
      sentiment: 0.6,
    },
    {
      name: "Optimistic Coder",
      handle: "@optimistic_coder",
      reply: "This opens up so many possibilities! Excited to explore.",
      sentiment: 0.95,
    },
    {
      name: "Data Scientist",
      handle: "@data_scientist",
      reply: "Impressive results. Would love to see the methodology.",
      sentiment: 0.85,
    },
    {
      name: "UX Designer",
      handle: "@ux_designer",
      reply: "Clean design, but accessibility could be improved.",
      sentiment: 0.65,
    },
    {
      name: "Startup Founder",
      handle: "@startup_founder",
      reply: "Game-changing potential. How soon can we implement?",
      sentiment: 0.9,
    },
    {
      name: "Ethical Tech",
      handle: "@ethical_tech",
      reply: "Innovative, but we need to consider the ethical implications.",
      sentiment: 0.55,
    },
    {
      name: "AI Researcher",
      handle: "@ai_researcher",
      reply: "Fascinating approach. Curious about the training data.",
      sentiment: 0.75,
    },
    {
      name: "Skeptical User",
      handle: "@skeptical_user",
      reply: "Sounds too good to be true. What's the catch?",
      sentiment: 0.25,
    },
    {
      name: "Tech Journalist",
      handle: "@tech_journalist",
      reply: "Groundbreaking if it delivers. Looking forward to testing.",
      sentiment: 0.7,
    },
    {
      name: "Product Manager",
      handle: "@product_manager",
      reply: "Great concept. How does it fit into existing workflows?",
      sentiment: 0.8,
    },
    {
      name: "Privacy Advocate",
      handle: "@privacy_advocate",
      reply: "Innovative, but raises serious privacy concerns.",
      sentiment: 0.4,
    },
    {
      name: "Tech Optimist",
      handle: "@tech_optimist",
      reply: "This is the future! Can't wait to see it in action.",
      sentiment: 0.95,
    },
    {
      name: "Cautious Adopter",
      handle: "@cautious_adopter",
      reply: "Interesting, but I'll wait for more real-world testing.",
      sentiment: 0.5,
    },
    {
      name: "Industry Analyst",
      handle: "@industry_analyst",
      reply: "Potential disruptor. Keeping a close eye on developments.",
      sentiment: 0.75,
    },
    {
      name: "Tech Skeptic",
      handle: "@tech_skeptic",
      reply: "Seen similar promises before. Doubtful it'll deliver.",
      sentiment: 0.15,
    },
    {
      name: "Enthusiastic Dev",
      handle: "@enthusiastic_dev",
      reply: "Can't wait to get my hands on this! So many possibilities!",
      sentiment: 0.95,
    },
  ];

  const getDistributedPosts = (posts: any[], count: number) => {
    const filteredPosts = posts.filter((post) => {
      if (startScore === null || endScore === null) return true;
      return (
        post.sentiment >= startScore / 100 && post.sentiment <= endScore / 100
      );
    });

    if (filteredPosts.length <= count) return filteredPosts;

    filteredPosts.sort((a, b) => a.sentiment - b.sentiment);
    const step = (filteredPosts.length - 1) / (count - 1);
    const distributedPosts = [];

    for (let i = 0; i < count; i++) {
      const index = Math.round(i * step);
      distributedPosts.push(filteredPosts[index]);
    }

    return distributedPosts;
  };

  const distributedPosts = getDistributedPosts(posts, 10);

  return (
    <VStack
      w="full"
      h="full"
      color="white"
      p={8}
      display="flex"
      position="relative"
      spacing={0}
      zIndex={20}
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        alignItems="center"
        justifyContent="center"
      >
        <BackgroundImage />
      </Box>
      <Button
        onClick={() => router.push("/search")}
        position="absolute"
        top={4}
        left={4}
        size="sm"
        leftIcon={<IoArrowBack />}
        bg="rgba(255,255,255,0.1)"
        _hover={{ bg: "rgba(255,255,255,0.2)" }}
      >
        Back
      </Button>
      <QueryPost name="Rag Pil" handle={handle} content={searchQuery} />
      <Box minH="50vh" w="full" mt={6}>
        <Graphs
          posts={posts}
          startScore={startScore}
          endScore={endScore}
          setStartScore={setStartScore}
          setEndScore={setEndScore}
        />
      </Box>
      <VStack w="full">
        <Text
          w="full"
          textAlign="center"
          fontSize="2xl"
          fontWeight="bold"
          mt={12}
        >
          {startScore && endScore ? `Sampled Posts` : "Posts"}
        </Text>
        <Button
          onClick={() => setIsAllPostsModalOpen(true)}
          mb={4}
          p={3}
          bg="rgba(255,255,255,0.1)"
          _hover={{ bg: "rgba(255,255,255,0.2)" }}
          mt={2}
          backdropFilter="blur(3px)"
        >
          View All
        </Button>
      </VStack>
      <HStack w="100%" justify="space-between" p={4}>
        <Box w="100%">
          <Grid
            templateColumns="repeat(2, 1fr)"
            gap={4}
            w="100%"
            justifyContent="center"
            alignItems="center"
          >
            {distributedPosts.map((post, index) => (
              <Box key={index} display="flex" justifyContent="center">
                <UserPost
                  name={post.name}
                  handle={post.handle}
                  reply={post.reply}
                  sentiment={post.sentiment}
                />
              </Box>
            ))}
          </Grid>
        </Box>
      </HStack>

      <Modal
        isOpen={isAllPostsModalOpen}
        onClose={() => setIsAllPostsModalOpen(false)}
        size="6xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>All Posts</ModalHeader>
          <ModalCloseButton />
          <ModalBody overflowY="scroll">
            <Grid
              templateColumns="repeat(2, 1fr)"
              gap={4}
              maxH="60vh"
              justifyContent="center"
              alignItems="center"
            >
              {posts.map((post, index) => (
                <Box key={index} display="flex" justifyContent="center">
                  <UserPost
                    name={post.name}
                    handle={post.handle}
                    reply={post.reply}
                    sentiment={post.sentiment}
                  />
                </Box>
              ))}
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsAllPostsModalOpen(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
