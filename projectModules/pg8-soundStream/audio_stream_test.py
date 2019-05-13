import unittest
import audio_stream

class TestStringMethods(unittest.TestCase):

    def setUp(self):
        f = open("doesExist.txt", "w+")

    def test_deleteFile(self):
        self.assertTrue(audio_stream.delete_speech("doesExist.txt"),"File Deleted")
        self.assertFalse(audio_stream.delete_speech("doesNotExist.txt"),"File Does not exist")

    def test_SoundStream(self):
        if "output_" not in audio_stream.listen_to_speech():
            out = True

        self.assertTrue(out,"File Built")

if __name__ == '__main__':
    unittest.main()