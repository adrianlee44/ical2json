import {untildify} from '../src/utils';
import test from 'ava';

test('untildify', (t) => {
  t.is(untildify('~/foo'), process.env.HOME + '/foo');
  t.is(untildify('~/foo/bar'), process.env.HOME + '/foo/bar');
  t.is(untildify('../foo'), '../foo');
  t.is(untildify('foo'), 'foo');
  t.is(untildify('~/'), process.env.HOME + '/');
});
