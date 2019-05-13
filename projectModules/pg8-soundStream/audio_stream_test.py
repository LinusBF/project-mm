import unittest
import audio_stream

class TestStringMethods(unittest.TestCase):

    def test_deletefile(self):
        f = None
        f = open("doesExist.txt", "w+")
        f.write("Content")
        self.assertTrue(audio_stream.delete_speech("doesExist.txt"),"File Deleted")
        self.assertFalse(audio_stream.delete_speech("doesNotExist.txt"),"File Does not exist")
        f.close()

    def test_soundstream(self):
        out = None
        if "output_" in audio_stream.listen_to_speech():
            out = True
        self.assertTrue(out,"File Built")

if __name__ == '__main__':
    unittest.main()