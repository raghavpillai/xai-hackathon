import { HStack, Image, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionText = motion(Text as any);
const MotionImage = motion(Image as any);
const MotionHStack = motion(HStack as any);

export default function TitleSection() {
  const words = ["Seek", "Ground", "Truth"];

  return (
    <VStack spacing={0}>
      <MotionHStack
        spacing={1}
        alignItems="center"
        justifyContent="center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <MotionText
          fontSize="8xl"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          e
        </MotionText>
        <MotionImage
          src="x-icon.png"
          w="58px"
          h="58px"
          filter="invert(100%)"
          mt={6}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 }}
        />
        <MotionText
          fontSize="8xl"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.6 }}
        >
          pect
        </MotionText>
      </MotionHStack>

      <MotionHStack
        spacing={1}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        {words.map((word, index) => (
          <MotionText
            key={index}
            fontSize="xl"
            fontWeight="bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 + index * 0.2 }}
          >
            {word}
          </MotionText>
        ))}
      </MotionHStack>
    </VStack>
  );
}
